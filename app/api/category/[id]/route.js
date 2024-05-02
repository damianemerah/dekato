import dbConnect from "@/utils/mongoConnection";
import Category from "@/app/models/category";
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

export async function PATCH(req, { params }) {
  await protect();
  await restrictTo("admin");
  try {
    const { id } = params;
    await dbConnect();

    const formData = await req.formData();
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
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req, { params }) {
  await protect();
  await restrictTo("admin");
  try {
    const { id } = params;
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
        { $set: { parent: deletedCategory.parent } }
      );
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
