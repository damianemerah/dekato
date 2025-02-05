import Order from "@/models/order";
import User from "@/models/user";
import Product from "@/models/product";
import Notification from "@/models/notification";
import { Cart, CartItem } from "@/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoConnection";
import Payment from "@/models/payment";
import { recommendationService } from "@/lib/recommendationService";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

async function handleOutOfStock(item, order, message) {
  await dbConnect();
  try {
    await Product.updateOne(
      { _id: item.productId },
      { $set: { status: "outofstock" } },
    );

    await Notification.create({
      userId: order.userId,
      title: "Out of Stock Alert",
      message,
      orderId: order._id,
      type: "warning",
    });
  } catch (error) {
    console.error(error, "error💎💎");
  }
}

async function updateProductQuantity(order) {
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  try {
    const products = order.product;

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        console.warn(
          `Product with ID ${item.productId} not found. Skipping update.`,
        );
        continue;
      }

      const variantId = item.variantId;
      const quantity = item.quantity;

      if (variantId) {
        const variantIndex = product.variant.findIndex(
          (index) => index._id.toString() === variantId,
        );

        if (variantIndex !== -1) {
          if (product.variant[variantIndex].quantity < quantity) {
            const message = `${item.name} variant ${Object.entries(
              product.variant[variantIndex].options,
            )
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")} is out of stock`;
            await handleOutOfStock(item, order, message);
            continue;
          }
          product.variant[variantIndex].quantity -= quantity;

          if (product.variant[variantIndex].quantity === 0) {
            const message = `${item.name} variant ${Object.entries(
              product.variant[variantIndex].options,
            )
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")} is out of stock`;
            await handleOutOfStock(item, order, message);
          }
        } else {
          console.warn(
            `Variant with ID ${variantId} not found. Skipping update for variant.`,
          );
        }
      } else {
        if (product.quantity < quantity) {
          const message = `${item.name} is out of stock`;
          await handleOutOfStock(item, order, message);
          continue;
        }
      }

      product.quantity -= quantity;
      product.sold += quantity;
      // product.purchaseCount = (product.purchaseCount || 0) + 1;

      if (product.quantity === 0) {
        const message = `${item.name} is out of stock`;
        await handleOutOfStock(item, order, message);
      }

      await product.save({ validateModifiedOnly: true });

      await recommendationService.trackProductInteraction(
        order.userId,
        item.productId,
        "purchase",
      );
    }

    if (order) {
      await CartItem.deleteMany({ _id: { $in: order.cartItems } });
      await Cart.updateOne(
        { userId: order.userId },
        { $pull: { item: { $in: order.cartItems } } },
        { new: true },
      );
    }
  } catch (error) {
    console.error(error, "😅😅");
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();

    const {
      reference,
      metadata: { orderId, userId, saveCard },
      id: paymentId,
      channel: paymentMethod,
      currency,
    } = body.data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Something went wrong", 404);
    }
    const verification = await Paystack.transaction.verify(reference);

    if (verification.data.status === "success") {
      await updateProductQuantity(order);
    }
    const OrderStatus = {
      FAILED: "failed",
      PENDING: "pending",
      SUCCESS: "success",
    };

    order.status =
      verification?.data?.status === "success"
        ? OrderStatus.SUCCESS
        : verification?.data?.status === "failed"
          ? OrderStatus.FAILED
          : OrderStatus.PENDING;

    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod;
    order.currency = currency;
    order.paidAt = verification?.data?.paidAt;

    await order.save();

    if (saveCard && !!verification?.data?.authorization) {
      const existingCard = await Payment.findOne({
        userId,
        "authorization.signature": verification?.data?.authorization?.signature,
      });

      if (!existingCard) {
        const cardData = {
          userId,
          email: verification?.data?.customer?.email,
          authorization: verification?.data?.authorization,
        };

        await Payment.create(cardData);
      }
    }

    if (verification?.data?.status === "success") {
      await Notification.create({
        userId: null, // Admin notification
        title: "New Order Payment",
        message: `New payment received: ${currency} ${order.total} for order #${order.paymentRef}`,
        orderId: order._id,
        type: "info",
      });

      const savedCount = await User.findByIdAndUpdate(userId, {
        $inc: { amountSpent: order.total, orderCount: 1 },
      });
    }

    revalidatePath("/account/orders");

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified",
        data: order,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
