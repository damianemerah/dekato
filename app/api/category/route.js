import dbConnect from "@/utils/mongoConnection";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import { handleFormData } from "@/utils/handleFormData";
import AppError from "@/utils/errorClass";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const body = await handleFormData(formData);

    const category = await Category.create(body);

    // If parent category is provided, add the category to the parent's children array
    if (category && body.parent) {
      const parent = await Category.findByIdAndUpdate(
        body.parent,
        { $push: { children: category._id } },
        { new: true }
      ).select("slug");

      if (!parent) {
        return NextResponse.json(
          { success: false, error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    console.log("Finding category 🙏🙏");

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    const category = await Category.find(searchParams).populate({
      path: "parent children",
      select: "slug",
    });

    if (!category) throw new AppError("Category not found", 404);
    else console.log("Category found 🙏🙏", category);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}
