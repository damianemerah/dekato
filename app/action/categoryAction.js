"use server";

import dbConnect from "@/lib/mongoConnection";
import Category from "@/models/category";
import { handleFormData } from "@/utils/handleForm";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function getCategories(slug) {
  await dbConnect();

  const category = await Category.find({ slug }).populate({
    path: "parent children",
    select: "slug",
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function createCategory(formData) {
  await restrictTo("admin");
  await dbConnect();

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
      throw new Error("Parent category not found");
    }

    //not tested
    return parent;
  }

  return category;
}

export async function updateCategory(id, formData) {
  await restrictTo("admin");
  await dbConnect();

  const body = await handleFormData(formData, Category, id);

  const category = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function deleteCategory(id) {
  await restrictTo("admin");
  await dbConnect();

  const deletedCategory = await Category.findByIdAndDelete(id);

  if (!deletedCategory) {
    throw new Error("Category not found");
  }

  const orphanedCategories = await Category.find({
    parent: deletedCategory._id,
  }).select("_id");

  if (orphanedCategories.length > 0) {
    await Category.updateMany(
      { parent: deletedCategory._id },
      { parent: null },
    );
  }

  return null;
}
