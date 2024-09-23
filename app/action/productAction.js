"use server";

import Product from "@/models/product";
import Category from "@/models/category";
import APIFeatures from "@/utils/apiFeatures";
import { handleFormData } from "@/utils/handleForm";
import { protect, restrictTo } from "@/utils/checkPermission";
import dbConnect from "@/lib/mongoConnection";
import { getQueryObj } from "@/utils/getFunc";
import handleAppError from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { deleteFiles } from "@/lib/s3Func";
import mongoose from "mongoose";

const setupIndexes = async () => {
  try {
    await dbConnect();
    await Product.collection.createIndex({
      name: "text",
      description: "text",
      tag: "text",
    });
    await Product.collection.createIndex({ cat: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ slug: 1 });
  } catch (error) {}
};

const formatProduct = (product) => {
  const { _id, category, variant, buffer, ...rest } = product;
  const formattedProduct = {
    id: _id.toString(),
    ...rest,
  };

  if (category) {
    formattedProduct.category = category.map((c) => {
      const { _id, buffer, ...rest } = c;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  }

  if (variant) {
    formattedProduct.variant = variant.map((v) => {
      const { _id, buffer, ...rest } = v;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  }

  return formattedProduct;
};

const handleProductQuery = async (query, searchParams = {}) => {
  const feature = new APIFeatures(query, searchParams)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const productData = await feature.query;
  return productData.map(formatProduct);
};

export async function getAdminProduct() {
  try {
    await dbConnect();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .lean();
    return products.map(formatProduct);
  } catch (err) {
    throw handleAppError(err);
  }
}

export async function productSearch(searchQuery) {
  try {
    await dbConnect();
    searchQuery.limit = 9;
    const products = await handleProductQuery(
      Product.find().select("name"),
      searchQuery,
    );
    return products.map(({ id, name }) => ({ id, name }));
  } catch (err) {
    throw handleAppError(err);
  }
}

export async function getVariantsByCategory(catName, searchStr = "") {
  try {
    await dbConnect();
    let matchCondition = {};

    if (searchStr && catName.toLowerCase() === "search") {
      const searchWords = searchStr.split(" ").map((word) => word.trim());
      const regexPattern = searchWords.map((word) => `\\b${word}`).join(".*");
      matchCondition = {
        $or: [
          { name: { $regex: regexPattern, $options: "i" } },
          { description: { $regex: regexPattern, $options: "i" } },
          { tag: { $elemMatch: { $regex: regexPattern, $options: "i" } } },
        ],
      };
    } else if (catName && catName !== "search") {
      const category = await Category.findOne({ slug: catName }).lean();
      if (!category) throw new Error("Category not found");
      matchCondition = {
        category: { $in: [category._id, ...category.children] },
      };
    } else {
      return;
    }

    const variantData = await Product.aggregate([
      { $match: matchCondition },
      { $unwind: "$variant" },
      { $project: { _id: 0, variant: 1 } },
    ]);

    return variantData.map(({ variant }) => ({
      variant: { id: variant._id.toString(), ...variant },
    }));
  } catch (err) {
    throw handleAppError(err);
  }
}

export async function getAllProducts(cat, searchParams = {}) {
  try {
    await dbConnect();
    const catName =
      cat && cat.length > 0 ? cat.slice(-1)[0].toLowerCase() : null;

    if (catName) {
      const category = await Category.findOne({ slug: catName }).lean();
      if (!category) {
        // Return an empty array or throw an error for invalid category
        return [];
        // Alternatively: throw new Error("Category not found");
      }

      const categoryIds = [category._id, ...(category.children || [])];
      const baseQuery = Product.find({ category: { $in: categoryIds } });
      const populatedQuery = baseQuery.populate("category", "slug").lean();
      const newSearchParams = getQueryObj(searchParams);

      return await handleProductQuery(populatedQuery, newSearchParams);
    } else {
      // If no category is specified, fetch all products
      const baseQuery = Product.find();
      const populatedQuery = baseQuery.populate("category", "slug").lean();
      const newSearchParams = getQueryObj(searchParams);

      return await handleProductQuery(populatedQuery, newSearchParams);
    }
  } catch (err) {
    throw handleAppError(err);
  }
}

export async function createProduct(formData) {
  try {
    await restrictTo("admin");
    await dbConnect();

    const categoryIds = formData.getAll("category");
    const obj = await handleFormData(formData, Category, categoryIds);
    const productDoc = await Product.create(obj);
    if (!productDoc) throw new Error("Product not created");

    revalidatePath("/admin/products");
    return formatProduct(productDoc.lean());
  } catch (err) {
    throw handleAppError(err);
  }
}

export async function updateProduct(formData) {
  try {
    await restrictTo("admin");
    await dbConnect();

    const id = formData.get("id");
    if (!id) throw new Error("Product not found");

    const data = await handleFormData(formData);
    const productToUpdate = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          formData.get(key) &&
          !key.startsWith("variantData") &&
          !key.startsWith("variantImage"),
      ),
    );

    if (data.variant) {
      const existingProduct = await Product.findById(id).lean();
      if (!existingProduct) throw new Error("Product not found");

      const existingVariantsMap = new Map(
        existingProduct.variant.map((v) => [v._id.toString(), v]),
      );

      productToUpdate.variant = data.variant.map((newVariant) => {
        const existingVariant = existingVariantsMap.get(newVariant._id);
        if (existingVariant) {
          return newVariant.image
            ? { ...existingVariant, ...newVariant }
            : {
                ...existingVariant,
                ...newVariant,
                image: existingVariant.image,
              };
        }
        return newVariant;
      });
    }

    const productData = await Product.findOneAndUpdate(
      { _id: id },
      productToUpdate,
      {
        new: true,
        runValidators: true,
        lean: true,
      },
    );

    revalidatePath(`/admin/products/${id}`);
    return formatProduct(productData);
  } catch (err) {
    throw handleAppError(err);
  }
}

export const deleteProduct = async (id) => {
  try {
    await restrictTo("admin");
    await dbConnect();

    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) throw new Error("Product not found");

    const imagesToDelete = [
      ...product.image,
      ...(product.video || []),
      ...(product.variant?.map((v) => v.image) || []),
    ].filter(Boolean);

    if (imagesToDelete.length) await deleteFiles(imagesToDelete);

    revalidatePath("/admin/products");
    return null;
  } catch (err) {
    throw handleAppError(err);
  }
};

export async function searchProduct(searchQuery) {
  const terms = searchQuery.split(" ");
  const regex = new RegExp(terms.join("|"), "i");

  return await Product.find({
    $or: [
      { $text: { $search: searchQuery } },
      { tag: { $in: terms } },
      { cat: regex },
    ],
  }).lean();
}

export async function getProductById(id) {
  await dbConnect();
  const product = await Product.findById(id).lean();
  if (!product) throw new Error("Product not found");
  return formatProduct(product);
}

export async function getProductsByCategory(cat) {
  await dbConnect();
  const products = await Product.find({ cat }).populate("category").lean();
  return products.map((product) => {
    const formattedProduct = formatProduct(product);
    // Remove the buffer property from category objects
    if (formattedProduct.category) {
      formattedProduct.category = formattedProduct.category.map(
        ({ id, ...rest }) => ({ id, ...rest }),
      );
    }
    return formattedProduct;
  });
}
