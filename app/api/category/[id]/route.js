import dbConnect from "@/utils/mongoConnection";
import Category from "@/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import { handleFormData } from "@/utils/handleFormData";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const id = params.id;

    console.log(id, "id👇👇");

    const category = await Category.findById(id);

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
