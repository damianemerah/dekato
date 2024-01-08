import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/appError";

export async function GET(req, { params }) {
  try {
    const id = params.id;
    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();

    await dbConnect();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: {} }, { status: 204 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
