import dbConnect from "@/lib/mongoConnection";
import Category from "@/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import { handleFormData } from "@/utils/handleForm";
import AppError from "@/utils/errorClass";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function POST(req) {
  await protect();
  await restrictTo("admin");
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
        { new: true },
      ).select("slug");

      if (!parent) {
        return NextResponse.json(
          { success: false, error: "Parent category not found" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 },
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
      { status: 200 },
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  await protect();
  await restrictTo("admin");
  try {
    const formData = await req.formData();
    const id = JSON.parse(formData.get("data")).categoryId;

    if (!id) throw new AppError("Category not found", 404);
    await dbConnect();

    const body = await handleFormData(formData, Category, id);

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return NextResponse.json(
      { success: true, data: category },
      { status: 200 },
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  await protect();
  await restrictTo("admin");
  try {
    const { id } = await req.json();
    await dbConnect();

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw new AppError("Category not found", 404);
    }

    // Find all children of the deleted category
    const orphanedChildrenIds = await Category.find({
      parent: deletedCategory._id,
    }).select("_id");

    if (!orphanedChildrenIds) {
      throw new AppError("Children not found", 404);
    }

    // Update all orphaned children's parent to the deleted category's grandparent
    if (orphanedChildrenIds.length > 0) {
      // Check if the parent ID of the deleted category is null

      // If parent ID is not null, set parent of orphaned children to deleted category's parent
      await Category.updateMany(
        { _id: { $in: orphanedChildrenIds } },
        { $set: { parent: deletedCategory.parent } },
      );
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
