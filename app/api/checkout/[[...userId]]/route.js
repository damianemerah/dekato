import Order from "@/app/models/order";
import Checkout from "@/app/models/checkout";
import { Cart, CartItem } from "@/app/models/cart";
import dbConnect from "@/utils/mongoConnection";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { NextResponse } from "next/server";
import filterObject from "@/utils/filterObj";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    await dbConnect();

    const cartItems = await Cart.findOne({ user: userId }).populate({
      path: "user",
      select: "email",
    });

    console.log(cartItems.user.email, "🔥cartItems");

    const items = cartItems.item.filter((item) => {
      return item.checked === true;
    });

    if (items.length === 0) {
      throw new AppError("No items selected", 400);
    }

    const amount = items.reduce((acc, item) => {
      return acc + item.price;
    }, 0);

    const itemsId = items.map((item) => item._id.toString());

    const checkoutData = {
      user: userId.toString(),
      product: itemsId,
      total: amount,
    };

    const existingCheckout = await Checkout.findOne({ user: userId });

    if (existingCheckout) {
      // update existing checkout
      existingCheckout.product = itemsId;
      existingCheckout.total = amount;
      await existingCheckout.save();

      return NextResponse.json(
        { success: true, data: existingCheckout },
        { status: 200 }
      );
    }

    const checkout = await Checkout.create(checkoutData);

    if (!checkout) {
      throw new AppError("Checkout could not be created", 500);
    }

    return NextResponse.json(
      { success: true, data: checkout },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    console.log(userId, "userId🔥");
    const checkoutProduct = await Checkout.findOne({ user: userId }).populate({
      path: "user",
      select: "email",
    });

    console.log(checkoutProduct, "🔥checkoutProduct");

    if (!checkoutProduct) {
      throw new AppError("Checkout product not found", 404);
    }

    //create order here
    //should we allow data from client or form it here?
    //adding shipping method and address to order here

    const order = await Order.create({
      user: userId,
      product: checkoutProduct.product,
      total: checkoutProduct.total,
    });

    if (!order) {
      throw new AppError("Order could not be created", 500);
    }

    const payment = await Paystack.transaction.initialize({
      email: checkoutProduct.user.email,
      amount: checkoutProduct.total * 100,
      callback_url: `${req.nextUrl.origin}`,
      currency: "NGN",
      metadata: {
        orderId: checkoutProduct._id,
      },
    });

    if (!payment) {
      throw new AppError("Payment could not be initialized", 500);
    }

    return NextResponse.json({ success: true, data: payment }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { userId } = body;

    const checkout = await Checkout.findOne({ user: userId });

    const obj = filterObject(body, "shippingMethod", "address");

    console.log(obj, "obj🔥");

    if (!checkout) {
      throw new AppError("Checkout not found", 404);
    }

    checkout.shippingMethod = obj.shippingMethod;
    checkout.address = obj.address;

    await checkout.save();

    console.log(checkout, "checkout🔥");

    return NextResponse.json(
      { success: true, data: checkout },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

//shippingmethod should not be recreated in cheackout
