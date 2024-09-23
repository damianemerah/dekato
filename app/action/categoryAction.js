"use server";

import mongoose from "mongoose";
import dbConnect from "@/lib/mongoConnection";
import Category from "@/models/category";
import { handleFormData } from "@/utils/handleForm";
import { protect, restrictTo } from "@/utils/checkPermission";
import handleAppError from "@/utils/appError";
import { revalidatePath } from "next/cache";

// Function to generate breadcrumbs using aggregation
export async function generateBreadcrumbs(categoryId) {
  await dbConnect();
  try {
    const result = await Category.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(categoryId) },
      },
      {
        $graphLookup: {
          from: "categories", // The collection you're querying
          startWith: "$parent", // Start with the parent field
          connectFromField: "parent", // The field from which to start the recursion
          connectToField: "_id", // The field to match against
          as: "breadcrumbs", // The output array field
          maxDepth: 5, // Set a reasonable limit to avoid performance issues
          depthField: "depth", // Optional: use this field to track the depth of recursion
        },
      },
      {
        $unwind: "$breadcrumbs", // Unwind the breadcrumbs array
      },
      {
        $sort: { "breadcrumbs.depth": 1 }, // Sort by depth to order correctly
      },
      {
        $project: {
          name: "$breadcrumbs.name",
          slug: "$breadcrumbs.slug",
          _id: 0, // Exclude the original _id
        },
      },
    ]);

    // Add the current category to the breadcrumbs
    const category = await Category.findById(categoryId).select("name slug");
    const breadcrumbs = result.map((r) => ({
      name: r.name,
      slug: r.slug,
    }));

    // Add the current category to the end of the breadcrumb array
    breadcrumbs.push({
      name: category.name,
      slug: category.slug,
    });

    // Add "Home" as the root of the breadcrumb trail
    breadcrumbs.unshift({ name: "Home", slug: "" });

    return breadcrumbs;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function getAllCategories() {
  await dbConnect();

  try {
    const categories = await Category.find(
      {},
      "name description image slug createdAt parent pinned pinOrder",
    )
      .populate("productCount")
      .populate("parent", "name _id slug")
      .lean();

    const formattedCat = categories.map(({ _id, parent, ...rest }) => {
      const { _id: pid, ...p } = parent || {};
      return {
        id: _id.toString(),
        parent: parent ? { id: pid.toString(), ...p } : null,
        ...rest,
      };
    });
    return formattedCat;
  } catch (err) {
    const error = handleAppError(err);
    throw Error(error.message || "Something went wrong");
  }
}

export async function getSubCategories(slug) {
  await dbConnect();
  try {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw new Error("Category not found");
    }

    const categories = await Category.find({ parent: category._id })
      .select("name description image slug createdAt")
      .populate("productCount")
      .sort({ slug: 1 })
      .lean();
    const formattedCat = categories.map(({ _id, parent, ...rest }) => {
      const { _id: pid, ...p } = parent || {};
      return {
        id: _id.toString(),
        parent: parent ? { id: pid.toString(), ...p } : null,
        ...rest,
      };
    });

    return formattedCat;
  } catch (err) {
    const error = handleAppError(err);
    throw Error(error.message || "Something went wrong");
  }
}

export async function createCategory(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const body = await handleFormData(formData);

    const categoryDoc = await Category.create(body);
    const category = categoryDoc.toObject();

    // If parent category is provided, add the category to the parent's children array
    if (category && body.parent) {
      const parentDoc = await Category.findByIdAndUpdate(
        body.parent,
        { $push: { children: category._id } },
        { new: true },
      );

      if (!parentDoc) {
        throw new Error("Parent category not found");
      }

      category.parent = parentDoc._id.toString();
    }

    const { _id, ...rest } = category;

    revalidatePath(`/admin/collections/${category.slug}`);
    return { id: _id.toString(), ...rest };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function updateCategory(formData) {
  await restrictTo("admin");
  await dbConnect();
  try {
    const id = formData.get("id");
    const data = await handleFormData(formData, Category, id);

    const body = {};

    for (const [key, _] of Object.entries(data)) {
      if (formData.get(key)) {
        body[key] = data[key];
      }
    }

    const categoryDoc = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .select("name description image slug createdAt parent pinned pinOrder")
      .populate("productCount")
      .populate("parent", "name _id slug");

    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    const category = categoryDoc.toObject();

    // Return category with id instead of _id
    const { _id, parent, ...rest } = category;

    revalidatePath(`/admin/collections/${category.slug}`);
    revalidatePath(`/admin/collections`);

    return { id: _id.toString(), ...rest };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function deleteCategory(id) {
  await restrictTo("admin");
  await dbConnect();

  try {
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
    const categoriesWithDeletedChild = await Category.find({
      children: deletedCategory._id,
    });
    for (const category of categoriesWithDeletedChild) {
      category.children = category.children.filter(
        (childId) => !childId.equals(deletedCategory._id),
      );
      await category.save();
    }

    revalidatePath("/admin/collections");
    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function getPinnedCategoriesByParent(parentSlug) {
  try {
    await dbConnect();

    let parentCategory;
    if (parentSlug) {
      parentCategory = await Category.findOne({ slug: parentSlug });
      if (!parentCategory) {
        console.warn(`Parent category with slug '${parentSlug}' not found`);
        return []; // Return an empty array instead of throwing an error
      }
    }

    const query = parentCategory
      ? { parent: parentCategory._id, pinned: true }
      : { parent: null, pinned: true };

    const pinnedCategories = await Category.find(query)
      .sort({ pinOrder: 1 })
      .limit(5)
      .lean();

    return pinnedCategories;
  } catch (err) {
    console.error("Error in getPinnedCategoriesByParent:", err);
    return []; // Return an empty array instead of throwing an error
  }
}
