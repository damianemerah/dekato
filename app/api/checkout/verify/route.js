import mongoose from "mongoose";
import Order from "@/models/order";
import Product from "@/models/product";
import Notification from "@/models/notification";
import { Cart, CartItem } from "@/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoConnection";
import Payment from "@/models/payment";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

async function handleOutOfStock(item, order, message, session) {
  await dbConnect();
  try {
    await Product.updateOne(
      { _id: item.productId },
      { $set: { status: "outofstock" } },
      { session },
    );

    await Notification.create(
      {
        userId: order.userId,
        title: "Out of Stock Alert",
        message,
        orderId: order._id,
        type: "warning",
      },
      { session },
    );
  } catch (error) {
    console.log(error, "error💎💎");
  }
}

async function updateProductQuantity(order) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const products = order.product;

    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);

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
            console.log("Out of Stock Alert11🔥🔥");
            await handleOutOfStock(item, order, message, session);
            continue;
          }
          product.variant[variantIndex].quantity -= quantity;

          if (product.variant[variantIndex].quantity === 0) {
            const message = `${item.name} variant ${Object.entries(
              product.variant[variantIndex].options,
            )
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")} is out of stock`;
            console.log("Out of Stock Alert33🔥🔥");
            await handleOutOfStock(item, order, message, session);
          }
        } else {
          console.warn(
            `Variant with ID ${variantId} not found. Skipping update for variant.`,
          );
        }
      } else {
        if (product.quantity < quantity) {
          console.log("Out of Stock Alert22🔥🔥");
          const message = `${item.name} is out of stock`;
          await handleOutOfStock(item, order, message, session);
          continue;
        }
      }

      product.quantity -= quantity;
      product.sold += quantity;

      if (product.quantity === 0) {
        console.log("Out of Stock Alert44🔥🔥");
        const message = `${item.name} is out of stock`;
        await handleOutOfStock(item, order, message, session);
      }

      await product.save({ session, validateModifiedOnly: true });
    }

    // Move cart operations outside product loop
    if (order) {
      await CartItem.deleteMany({ _id: { $in: order.cartItems } }, { session });
      await Cart.updateOne(
        { userId: order.userId },
        { $pull: { item: { $in: order.cartItems } } },
        { new: true, session },
      );
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
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

    // Update product quantity (variants considered)
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

    order.paymentRef = reference;
    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod;
    order.currency = currency;
    order.paidAt = verification?.data?.paidAt;

    await order.save();

    if (saveCard === true && verification?.data?.authorization) {
      const cardData = {
        userId,
        email: verification?.data?.customer?.email,
        authorization: verification?.data?.authorization,
      };

      const payment = await Payment.create(cardData);
    }

    // Create notification for admin about successful payment
    if (verification?.data?.status === "success") {
      console.log("creating notification💎💎");
      await Notification.create({
        userId: null, // Admin notification
        title: "New Order Payment",
        message: `New payment received: ${currency} ${order.total} for order #${order.paymentRef}`,
        orderId: order._id,
        type: "info",
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
    console.log(error, "payment_error💎💎");
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
