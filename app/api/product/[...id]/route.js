import dbConnect from "@/lib/mongoConnection";
import Product from "@/models/product";
import Address from "@/models/address";
import Order from "@/models/order";
import User from "@/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import { startSession } from "mongoose";
import getComputedStyleQuantity from "@/utils/getQuantity";
import { protect, restrictTo } from "@/utils/checkPermission";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const id = params.id[0];
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

//Single product order
export async function POST(req, { params }) {
  await restrictTo("admin", "user");
  await dbConnect();
  const session = await startSession();

  try {
    session.startTransaction();

    const [, pay] = params.id;
    const id = params.id[0];

    if (pay.toLowerCase() !== "pay") {
      throw new AppError("Invalid route", 404);
    }

    const body = await req.json();
    const { userId, product: singleProduct, shippingMethod, address } = body;
    const product = await Product.findById(id);
    let variant;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (singleProduct.variantId) {
      variant = product.variant.find((item) => {
        return item._id.toString() === singleProduct.variantId;
      });
    }

    getComputedStyleQuantity(singleProduct, product);

    if (shippingMethod.toLowerCase() === "delivery" && !address) {
      throw new AppError("Address is required for delivery", 400);
    }

    if (shippingMethod.toLowerCase() === "delivery") {
      const userAddress = await Address.findOne({ user: userId }).session(
        session,
      );

      if (!userAddress) {
        throw new AppError("User address not found", 404);
      }
    }

    const amount = Math.ceil(
      singleProduct.variantId
        ? variant.price || product.price * singleProduct.quantity
        : product.price * singleProduct.quantity,
    );

    const orderData = {
      user: userId,
      singleProduct,
      total: amount,
      type: "single",
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
      email: user.email,
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
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return handleAppError(error, req);
  } finally {
    session.endSession();
  }
}
