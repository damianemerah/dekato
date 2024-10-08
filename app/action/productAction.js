"use server";

import Product from "@/models/product";
import Category from "@/models/category";
import Collection from "@/models/collection";
import APIFeatures from "@/utils/apiFeatures";
import { handleFormData } from "@/utils/handleForm";
import { protect, restrictTo } from "@/utils/checkPermission";
import dbConnect from "@/lib/mongoConnection";
import { getQueryObj } from "@/utils/getFunc";
import handleAppError from "@/utils/appError";
import { revalidatePath, revalidateTag } from "next/cache";
import { deleteFiles } from "@/lib/s3Func";

const setupIndexes = async () => {
  try {
    await dbConnect();
    await Promise.all([
      Product.collection.createIndex({
        name: "text",
        description: "text",
        tag: "text",
      }),
      Product.collection.createIndex({ cat: 1 }),
      Product.collection.createIndex({ price: 1 }),
      Product.collection.createIndex({ slug: 1 }),
    ]);
  } catch (error) {
    console.error("Error setting up indexes:", error);
  }
};

const formatProduct = (product) => {
  const { _id, category, variant, ...rest } = product;
  return {
    id: _id.toString(),
    ...rest,
    category: category?.map(({ _id, ...c }) => ({ id: _id.toString(), ...c })),
    variant: variant?.map(({ _id, ...v }) => ({ id: _id.toString(), ...v })),
  };
};

const handleProductQuery = async (query, searchParams = {}) => {
  const feature = new APIFeatures(query, searchParams)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const productData = await feature.query;

  if (!productData?.length) return [];

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
    const error = handleAppError(err);
    throw new Error(error.message);
    throw handleAppError(err);
  }
}

export async function productSearch(searchQuery) {
  try {
    await dbConnect();
    const products = await handleProductQuery(
      Product.find().select("name slug").lean(),
      { ...searchQuery, limit: 9 },
    );
    return products.map(({ id, name, slug }) => ({ id, name, slug }));
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
    throw handleAppError(err);
  }
}

export async function getVariantsByCategory(catName, searchStr = "") {
  try {
    await dbConnect();
    let matchCondition = {};

    if (searchStr && catName.toLowerCase() === "search") {
      const regexPattern = searchStr
        .split(" ")
        .map((word) => `\\b${word.trim()}`)
        .join(".*");
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
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getAllProducts(cat, searchParams = {}) {
  try {
    await dbConnect();
    const catName = cat?.slice(-1)[0]?.toLowerCase();
    let baseQuery = Product.find();

    console.log(catName, "catName🔥🔥🔥");

    if (catName && catName !== "search") {
      const category = await Category.findOne({ slug: catName }).lean();
      const collection = await Collection.findOne({ slug: catName }).lean();

      if (!category && !collection) return null;

      if (category) {
        const categoryIds = [category._id, ...(category.children || [])];
        baseQuery = Product.find({ category: { $in: categoryIds } });
      } else if (collection) {
        baseQuery = Product.find({ collection: collection._id });
      }
    }

    const populatedQuery = baseQuery
      .populate("category", "slug")
      .populate("collection", "slug")
      .lean();
    const newSearchParams = getQueryObj(searchParams);

    return await handleProductQuery(populatedQuery, newSearchParams);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function createProduct(formData) {
  try {
    await restrictTo("admin");
    await dbConnect();

    const obj = await handleFormData(formData);
    const productDoc = await Product.create(obj);
    if (!productDoc) throw new Error("Product not created");

    revalidateProduct(productDoc.slug);
    return formatProduct(productDoc);
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
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
      productToUpdate.variant = data.variant;
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

    revalidateProduct(productData.slug);

    return formatProduct(productData);
  } catch (err) {
    return handleAppError(err);
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
      ...(product.variant?.flatMap((v) => v.image) || []),
    ].filter(Boolean);

    if (imagesToDelete.length) await deleteFiles(imagesToDelete);

    revalidateProduct(product.slug);

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
    throw handleAppError(err);
  }
};

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
    if (formattedProduct.category) {
      formattedProduct.category = formattedProduct.category.map(
        ({ id, ...rest }) => ({ id, ...rest }),
      );
    }
    return formattedProduct;
  });
}

function revalidateProduct(id) {
  revalidatePath(`/admin/products/${id}`);
  revalidateTag("single-product-data");
  revalidateTag("products-all");
  revalidatePath("/admin/products");
  revalidateTag("checkout-data");
}

// Call setupIndexes when the module is first loaded
// setupIndexes();
