import Order from "@/models/order";
import Product from "@/models/product";
import { Cart, CartItem } from "@/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { protect, restrictTo } from "@/utils/checkPermission";
import { revalidatePath } from "next/cache";
import Payment from "@/models/payment";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const mongoose = require('mongoose');

async function updateProductQuantity(order) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const products = order.type === "cart" ? order.product : [order.singleProduct];

    for (const item of products) {
      const product = await Product.findById(item.productId || item.product).session(session);

      if (!product) {
        throw new Error('Product not found');
      }

      const variantId = item.variantId;
      const quantity = item.quantity;

      if (variantId) {
        const variantIndex = product.variant.findIndex(
          (index) => index._id.toString() === variantId
        );

        if (variantIndex === -1 || product.variant[variantIndex].quantity < quantity) {
          throw new Error('Insufficient variant quantity');
        }

        product.variant[variantIndex].quantity -= quantity;
      } else {
        if (product.quantity < quantity) {
          throw new Error('Insufficient product quantity');
        }
      }

      product.quantity -= quantity;
      product.sold += quantity;

      await product.save({ session });

      if (order.type === "cart") {
        await CartItem.deleteOne({ _id: item._id }, { session });
        await Cart.updateOne(
          { userId: order.userId },
          { $pull: { item: item._id } },
          { new: true, session }
        );
      }
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function POST(req) {
  // await restrictTo("admin", "user");
  try {
    const body = await req.json();

    const {
      reference,
      metadata: { orderId, userId, receipt_number, saveCard },
      id: paymentId,
      channel: paymentMethod,
      currency,
    } = body.data;

    console.log(paymentId, "paymentId💎💎");

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Something went wrong", 404);
    }
    const verification = await Paystack.transaction.verify(reference);

    console.log(verification, "verification💎💎");

    //update product quantity (variants considered)
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
    order.receiptNumber = receipt_number;
    order.paidAt = verification?.data?.paidAt;

    await order.save();

    console.log(saveCard, "saveCard💎💎");

    if (saveCard && verification?.data?.authorization?.reusable) {
      const cardData = {
        userId,
        email: verification?.data?.customer?.email,
        cardType: verification?.data?.authorization?.card_type,
        last4: verification?.data?.authorization?.last4,
        expiryMonth: verification?.data?.authorization?.exp_month,
        expiryYear: verification?.data?.authorization?.exp_year,
        authorizationCode:
          verification?.data?.authorization?.authorization_code,
      };

      const payment = await Payment.create(cardData);
      console.log(payment, "payment💎💎");
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
