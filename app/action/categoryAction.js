"use server";

import dbConnect from "@/lib/mongoConnection";
import Category from "@/models/category";
import Product from "@/models/product";
import { handleFormData } from "@/utils/handleForm";
import { restrictTo } from "@/utils/checkPermission";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";
import { revalidatePath } from "next/cache";
import { formatCategories } from "@/utils/filterHelpers";

export async function getAllCategories(params) {
  try {
    await dbConnect();

    const query = Category.find(
      {},
      "name description image slug createdAt parent pinned pinOrder ",
    )
      .populate("parent", "name _id slug")
      .lean({ virtuals: true });

    const searchParams = {
      page: params?.page || 1,
      limit: params?.limit || 20,
    };

    const feature = new APIFeatures(query, searchParams).paginate().sort();

    const categoryData = await feature.query;

    const formattedData = await Promise.all(
      categoryData.map(async ({ _id, parent, ...rest }) => {
        const productCount = await Product.countDocuments({
          category: _id,
        });

        return {
          id: _id.toString(),
          parent: parent
            ? {
                id: parent._id.toString(),
                name: parent.name,
                slug: parent.slug,
              }
            : null,
          productCount,
          ...rest,
        };
      }),
    );

    const totalCount = await Category.countDocuments(query.getFilter());

    return { data: formattedData, totalCount, limit: searchParams.limit };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getSubCategories(slug) {
  try {
    await dbConnect();

    // Early return for search routes
    if (!Array.isArray(slug) || slug[0].toLowerCase() === "search") {
      return null;
    }

    // Find parent category and populate children
    const parentCategory = await Category.findOne({
      slug: slug[0].toLowerCase(),
    })
      .populate("children", "name description image slug createdAt")
      .sort({ slug: 1 })
      .lean();

    if (!parentCategory) {
      return null;
    }

    // Format and return the children categories
    const formattedCategories = formatCategories(parentCategory.children || []);
    return formattedCategories;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "Something went wrong");
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

    // Get products count
    const productCount = await Product.countDocuments({
      category: _id,
    });

    revalidatePath(`/admin/categories/${category.slug}`);
    return { id: _id.toString(), productCount, ...rest };
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
      .populate("parent", "name _id slug");

    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    const category = categoryDoc.toObject();

    // Get products count
    const productCount = await Product.countDocuments({
      category: category._id,
    });

    // Return category with id instead of _id
    const { _id, parent, ...rest } = category;

    return {
      id: _id.toString(),
      parent: parent
        ? {
            id: parent._id.toString(),
            name: parent.name,
            slug: parent.slug,
          }
        : null,
      productCount,
      ...rest,
    };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function deleteCategory(id) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
      throw new Error("Category not found");
    }

    // Check if any products are using this category
    const productsUsingCategory = await Product.countDocuments({
      category: id,
    });

    if (productsUsingCategory > 0) {
      throw new Error(
        "Cannot delete category. It is still being used by products.",
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

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

    revalidatePath("/admin/categories");
    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function getPinnedCategoriesByParent(parentSlug) {
  await dbConnect();

  let parentCategory;
  if (parentSlug) {
    parentCategory = await Category.findOne({ slug: parentSlug }).lean();
    if (!parentCategory) {
      return [];
    }
  }

  const pinnedCategories = await Category.find({
    parent: parentCategory._id,
    pinned: true,
  })
    .sort({ pinOrder: 1 })
    .limit(5)
    .lean();

  return pinnedCategories;
}
