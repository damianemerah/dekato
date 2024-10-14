import Order from "@/models/order";
import Address from "@/models/address";
import { Cart } from "@/models/cart";
import dbConnect from "@/lib/mongoConnection";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { NextResponse } from "next/server";
import { startSession } from "mongoose";
import { restrictTo } from "@/utils/checkPermission";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  await restrictTo("admin", "user");
  try {
    const { userId } = params;

    await dbConnect();

    const cartItems = await Cart.findOne({ userId: userId[0] });

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
      userId: userId.toString(),
      product: items,
      total: amount,
    };

    return NextResponse.json(
      { success: true, data: checkoutData },
      { status: 200 },
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req, { params }) {
  // await restrictTo("admin", "user");
  await dbConnect();
  const session = await startSession();
  try {
    session.startTransaction();

    const {
      userId: [userId],
    } = params;
    const body = await req.json();
    const { shippingMethod, address, items, amount, email } = body;

    if (shippingMethod?.toLowerCase() === "delivery" && !address) {
      throw new AppError("Address is required for delivery", 400);
    }

    if (shippingMethod?.toLowerCase() === "delivery") {
      const userAddress = await Address.findOne({
        userId,
        _id: address.id,
        isDefault: true,
      }).session(session);

      if (!userAddress) {
        throw new AppError("User address not found", 404);
      }
    }

    const orderData = {
      userId: userId,
      cartItem: items.map((item) => item.id),
      total: amount,
      type: "cart",
      shippingMethod: shippingMethod?.toLowerCase(),
      address:
        shippingMethod?.toLowerCase() === "delivery" ? address.id : undefined,
    };

    console.log(orderData, "orderData👇👇👇");

    //session require array of objects
    const order = await Order.create([orderData], { session });

    const createdOrder = order[0];

    if (!order) {
      throw new AppError("Order could not be created", 500);
    }

    const payment = await Paystack.transaction.initialize({
      email: email,
      amount: Math.round(amount * 100),
      callback_url: `${req.nextUrl.origin}`,
      currency: "NGN",
      metadata: {
        orderId: createdOrder["_id"].toString(),
        userId,
        receipt_number: createdOrder.receiptNumber,
      },
    });

    if (!payment || payment.status === false) {
      throw new AppError(payment.message, 500);
    }

    await session.commitTransaction();

    return NextResponse.json(
      { success: true, data: { payment, order: createdOrder } },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 },
    );
  } finally {
    session.endSession();
  }
}
