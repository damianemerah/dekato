"use server";

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
      "name description image slug createdAt parent",
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

export async function getCategories(slug) {
  try {
    await dbConnect();
    const query = !slug || slug === "home" ? { parent: null } : { slug };

    const categoryDocs = await Category.find(query).populate({
      path: "children",
      select: "-__v -children.parent",
    });

    if (!categoryDocs) {
      throw new Error("Category not found");
    }

    // Convert each document to a plain JavaScript object and modify the _id fields
    const categories = categoryDocs.map((categoryDoc) => {
      const category = categoryDoc.toObject();

      // Rename _id to id and convert to string
      const { _id, children, parent, ...rest } = category;

      return {
        id: _id.toString(),
        ...rest,

        // Convert children _id to strings and remove parent field if it exists
        children: children.map((child) => {
          const { _id, parent, children, ...childRest } = child;
          return {
            id: _id.toString(),
            ...childRest,
          };
        }),
      };
    });

    return categories;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
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
    const body = await handleFormData(formData, Category, id);

    const categoryDoc = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    const category = categoryDoc.toObject();

    // Return category with id instead of _id
    const { _id, ...rest } = category;

    revalidatePath(`/admin/collections/${category.slug}`);
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

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}
