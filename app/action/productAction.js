"use server";

import { Product } from "@/models/product";
import APIFeatures from "@/utils/apiFeatures";
import { handleFormData } from "@/utils/handleForm";
import Category from "@/models/category";
import { protect, restrictTo } from "@/utils/checkPermission";
import dbConnect from "@/lib/mongoConnection";
import { includePriceObj } from "@/utils/searchWithPrice";
import { update } from "lodash";
import { z } from "zod";
import { formDataToObject } from "@/utils/filterObj";

const getProductVariants = async (productIds) => {
  try {
    const variants = await Product.aggregate([
      { $match: { _id: { $in: productIds } } },
      { $unwind: "$variants" },
      {
        $group: {
          _id: null,
          colors: { $addToSet: "$variants.color" },
          sizes: { $addToSet: "$variants.size" },
        },
      },
      {
        $project: {
          _id: 0,
          colors: 1,
          sizes: 1,
        },
      },
    ]);

    return variants[0] || { colors: [], sizes: [] }; // Handle case where no variants are found
  } catch (error) {
    throw new Error("Failed to fetch product variants");
  }
};

// const productIds = products.map((product) => product._id);
// const variants = await getProductVariants(productIds);

export async function getAllProducts(cat, searchParams = {}) {
  console.log("Search Params:🚀💎💎💎", searchParams);
  try {
    searchParams.cat = cat;
    const newSearchParams = includePriceObj(searchParams);

    await dbConnect();

    const feature = new APIFeatures(Product.find().lean(), newSearchParams)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await feature.query;

    for (let i = 0; i < products.length; i++) {
      products[i]._id = products[i]._id.toString();

      if (products[i].category) {
        products[i].category = products[i].category.toString();
      }
    }

    console.log(products, "products🚀🚀🚀");
    return products;
  } catch (error) {
    return error;
  }
}

export async function createProduct(formData) {
  await restrictTo("admin");
  await dbConnect();

  const obj = await handleFormData(formData);

  const category = await Category.findById(obj.category);

  if (!category) throw new Error("Category not found");

  const product = await Product.create(obj);

  if (!product) throw new Error("Product not created");

  console.log(product, "product🚀🚀🚀");

  return product;
}

//Entire product object is being updated
export async function updateProduct(id, formData) {
  console.log("Form Data:🚀💎💎💎", formData);

  await restrictTo("admin");
  await dbConnect();

  // Find the existing product
  if (!id) throw new AppError("Product not found", 404);
  const productToUpdate = await handleFormData(formData, Product, id);
  const existingProduct = await Product.findById(id);
  if (!existingProduct) throw new AppError("Product not found", 404);

  // Create a map of existing variant IDs to their corresponding variant objects

  if (productToUpdate.variant) {
    const existingVariantsMap = new Map(
      existingProduct.variant.map((variant) => [
        variant._id.toString(),
        variant,
      ]),
    );

    // Update existing variants and collect new variants
    const updatedVariants = productToUpdate.variant.map((newVariant) => {
      const existingVariant = existingVariantsMap.get(newVariant._id);
      if (existingVariant) {
        // Merge existing and new variant fields
        return { ...existingVariant.toObject(), ...newVariant };
      } else {
        // New variant, add it as is
        return newVariant;
      }
    });

    // Replace the variant array with the updated and new variants
    productToUpdate.variant = updatedVariants;
    // Update the product
    const product = await Product.findByIdAndUpdate(id, updatedVariants, {
      new: true,
      runValidators: true,
    });

    return product;
  }

  const product = await Product.findByIdAndUpdate(id, productToUpdate, {
    new: true,
    runValidators: true,
  });

  return product;
}

export const deleteProduct = async (id) => {
  await restrictTo("admin");
  await dbConnect();

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await deleteFiles(product.image);
  if (product.video && product.video.length > 0) {
    await deleteFiles(product.video);
  }

  return null;
};

export async function searchProduct(searchQuery) {
  const terms = searchQuery.split(" ");
  const regex = new RegExp(terms.join("|"), "i");

  const products = await Product.find({
    $or: [
      { $text: { $search: searchQuery } }, // Full-text search on 'name'
      { tags: { $in: terms } }, // Match any tag in 'tags' array
      { cat: regex }, // Match any category that contains the search terms
    ],
  });

  return products;
}

export async function getProductById(id) {
  await dbConnect();

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function getProductsByCategory(cat) {
  await dbConnect();
  const products = await Product.find({ cat }).populate("category").lean();
  return products;
}
