import Order from "@/app/models/order";
import Address from "@/app/models/address";
import { Cart } from "@/app/models/cart";
import dbConnect from "@/utils/mongoConnection";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { NextResponse } from "next/server";
import { startSession } from "mongoose";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  try {
    const { userId } = params;

    await dbConnect();

    const cartItems = await Cart.findOne({ user: userId })
      .populate({
        path: "user",
        select: "email",
      })
      .populate("item");

    const items = cartItems.item.filter((item) => {
      return item.checked === true;
    });

    if (items.length === 0) {
      throw new AppError("No items selected", 400);
    }

    const amount = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const checkoutData = {
      user: userId.toString(),
      product: items,
      total: amount,
    };

    return NextResponse.json(
      { success: true, data: checkoutData },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req) {
  await dbConnect();
  const session = await startSession();
  try {
    session.startTransaction();

    const body = await req.json();
    const { userId, shippingMethod, address } = body;

    const checkoutProduct = await Cart.findOne({ user: userId })
      .populate({
        path: "item",
        match: { checked: true },
      })
      .populate({
        path: "user",
        select: "email",
      });

    const checkoutItems = checkoutProduct.item;

    if (!checkoutItems || checkoutItems.length === 0) {
      throw new AppError("No items selected", 400);
    }

    const amount = Math.ceil(
      checkoutItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0)
    );

    //check if address is user's address

    if (shippingMethod.toLowerCase() === "delivery" && !address) {
      throw new AppError("Address is required for delivery", 400);
    }

    if (shippingMethod.toLowerCase() === "delivery") {
      const userAddress = await Address.findById(address);

      if (!userAddress) {
        throw new AppError("User address not found", 404);
      }
    }

    const orderData = {
      user: userId,
      item: checkoutItems,
      total: amount,
      shippingMethod: shippingMethod,
      address:
        shippingMethod.toLowerCase() === "delivery" ? address : undefined,
    };

    const order = await Order.create([orderData], { session });

    const createdOrder = order[0];

    if (!order) {
      throw new AppError("Order could not be created", 500);
    }

    const payment = await Paystack.transaction.initialize({
      email: checkoutProduct.user.email,
      amount: amount * 100,
      callback_url: `${req.nextUrl.origin}`,
      currency: "NGN",
      metadata: {
        orderId: createdOrder["_id"].toString(),
        userId,
      },
    });

    if (!payment || payment.status === false) {
      console.log(payment);
      throw new AppError(payment.message, 500);
    }

    await session.commitTransaction();

    return NextResponse.json(
      { success: true, data: { payment, order: createdOrder } },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    return handleAppError(error, req);
  } finally {
    session.endSession();
  }
}
