import dbConnect from "@/utils/mongoConnection";
import { Product } from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  try {
    const id = params.id;

    console.log("GET ROUTE 💎💎💎", id[0]);
    await dbConnect();

    const product = await Product.findById(id[0]);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req, { params }) {
  try {
    const [, pay] = params.id;
    const id = params.id[0];

    if (pay.toLowerCase() !== "pay") {
      throw new AppError("Invalid route", 404);
    }

    const body = await req.json();
    const { userId, variantId } = body;
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stock === 0) {
      throw new AppError("Product out of stock", 400);
    }

    console.log(product);

    return NextResponse.json({ success: true, data: pay }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
