import Order from "@/app/models/order";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    console.log(
      req.headers.get("x-paystack-signature"),
      body,
      "Signature from Paystack🔥🔥"
    );

    //early return

    return NextResponse.json(
      { success: true, message: "Payment verified" },
      { status: 200 }
    );

    const {
      reference,
      metadata: { orderId },
    } = body.data;

    const order = await Order.findById(orderId);

    const verification = await Paystack.transaction.verify(reference);

    if (verification.data.status !== "success") {
      throw new AppError("Payment verification failed", 400);
    }

    order.paymentRef = reference;
    order.paymentId = verification.data.id;
    order.status = "completed";

    await order.save();

    console.log(order);

    return NextResponse.json(
      { success: true, message: "Payment verified" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleAppError(error, req);
  }
}
