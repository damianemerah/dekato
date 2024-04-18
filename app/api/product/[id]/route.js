import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import { uploadFiles, deleteFiles } from "@/utils/s3Func";
import { handleFormData } from "@/utils/handleFormData";

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
    await dbConnect();

    const { id } = params;
    const formData = await req.formData();

    const body = await handleFormData(formData, Product, id);

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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

    await deleteFiles(product.image);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
