import dbConnect from "@/utils/mongoConnection";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    await dbConnect();

    const category = await Category.findOne({ slug: slug });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req, { params }) {
  try {
    const { slug } = params;
    await dbConnect();

    const body = await req.json();

    const category = await Category.findOneAndUpdate({ slug: slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = params;
    await dbConnect();

    const category = await Category.findOneAndDelete({ slug: slug });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}
