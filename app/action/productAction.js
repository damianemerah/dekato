"use server";

import Product from "@/models/product";
import APIFeatures from "@/utils/apiFeatures";
import { handleFormData } from "@/utils/handleForm";
import Category from "@/models/category";
import { protect, restrictTo } from "@/utils/checkPermission";
import dbConnect from "@/lib/mongoConnection";
import { includePriceObj } from "@/utils/searchWithPrice";
import { formDataToObject } from "@/utils/filterObj";
import handleAppError from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { deleteFiles } from "@/lib/s3Func";

function arrayToMap(arr) {
  const map = new Map();

  for (const item of arr) {
    const key = JSON.stringify(item);
    map.set(key, item);
  }
  return map;
}

const setupIndexes = async () => {
  try {
    await dbConnect();

    // Create indexes
    await Product.collection.createIndex({
      name: "text",
      description: "text",
      tag: "text",
    });
    await Product.collection.createIndex({ cat: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ slug: 1 });
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};

// setupIndexes();

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

export async function getAdminProduct() {
  try {
    await dbConnect();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .lean();

    const formattedProducts = products.map((product) => {
      const { _id, category, variant, ...rest } = product;

      const formattedProduct = {
        id: _id.toString(),
        ...rest,
      };

      if (category) {
        formattedProduct.category = category.map((c) => {
          const { _id, ...rest } = c;

          return { id: _id.toString(), ...rest };
        });
      }

      if (variant) {
        formattedProduct.variant = variant.map((v) => {
          const { _id, ...rest } = v;
          return { id: _id.toString(), ...rest };
        });
      }

      return formattedProduct;
    });

    return formattedProducts;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getAllProducts(cat, searchParams = {}) {
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

    return products;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function createProduct(formData) {
  try {
    await restrictTo("admin");
    await dbConnect();

    const id = formData.get("category");
    const obj = await handleFormData(formData, Category, id);

    const productDoc = await Product.create(obj);
    if (!productDoc) throw new Error("Product not created");

    const product = productDoc.toObject();
    const { category: productCategories, _id, ...rest } = product;

    if (product.variant) {
      const variants = product.variant.map((variant) => {
        const { _id, ...rest } = variant;

        return { id: _id.toString(), ...rest };
      });
      return { id: _id.toString(), ...rest, variant: variants };
    }

    revalidatePath("/admin/products");

    return { id: _id.toString(), ...rest };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

//Entire product object is being updated
export async function updateProduct(formData) {
  await restrictTo("admin");
  await dbConnect();

  try {
    const id = formData.get("id");
    // Find the existing product
    if (!id) throw new AppError("Product not found", 404);
    const productToUpdate = await handleFormData(formData, Product, id);

    Object.entries(productToUpdate).forEach(([key, value]) => {
      if (key.startsWith("variantData") || key.startsWith("variantImage")) {
        delete productToUpdate[key];
      }
    });

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
          if (!newVariant.image) {
            const { image, ...restOfVariant } = existingVariant.toObject();
            return { ...restOfVariant, ...newVariant };
          }
          return { ...existingVariant.toObject(), ...newVariant };
        } else {
          return newVariant;
        }
      });

      // Replace the variant array with the updated and new variants
      productToUpdate.variant = updatedVariants;
    }
    // Update the product
    const productData = await Product.findByIdAndUpdate(id, productToUpdate, {
      new: true,
      runValidators: true,
    });

    const {
      _id,
      category: productCategories,
      variant,
      ...rest
    } = productData.toObject();

    const productVariant = variant.map((v) => {
      const { _id, ...rest } = v;
      return { id: _id.toString(), ...rest };
    });

    const productCategory = productCategories.map((c) => ({
      id: c._id.toString(),
    }));

    revalidatePath(`/admin/products/${id}`);

    return {
      id: _id.toString(),
      ...rest,
      variant: productVariant,
      category: productCategory,
    };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export const deleteProduct = async (id) => {
  try {
    await restrictTo("admin");
    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error("Product not found");
    }

    product?.image.length && (await deleteFiles(product.image));

    if (product.video && product.video.length > 0) {
      await deleteFiles(product.video);
    }

    if (product.variant && product.variant.length > 0) {
      const variantImages = product.variant.map((variant) => variant.image);
      variantImages.length && (await deleteFiles(variantImages));
    }

    revalidatePath("/admin/products");

    return null;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
};

export async function searchProduct(searchQuery) {
  const terms = searchQuery.split(" ");
  const regex = new RegExp(terms.join("|"), "i");

  const products = await Product.find({
    $or: [
      { $text: { $search: searchQuery } }, // Full-text search on 'name'
      { tag: { $in: terms } }, // Match any tag in 'tags' array
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
