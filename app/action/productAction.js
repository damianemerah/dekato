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
          console.log(rest, "rest🔥✔️✔️✔️");
          return { id: _id.toString(), ...rest };
        });
      }

      return formattedProduct;
    });

    // console.log(formattedProducts, "formattedProducts🚀🚀🚀");

    return formattedProducts;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function productSearch(searchQuery) {
  try {
    await dbConnect();

    searchQuery.limit = 9;

    const feature = new APIFeatures(Product.find().select("name"), searchQuery)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const productData = await feature.query;

    const products = productData.map((product) => {
      const { _id, name } = product;
      return { id: _id.toString(), name };
    });

    return products;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getVariantsByCategory(catName, searchStr = "") {
  try {
    await dbConnect();

    let matchCondition = {};

    if (searchStr && catName.toLowerCase() === "search") {
      // Split the search string into individual words
      const searchWords = searchStr.split(" ").map((word) => word.trim());
      const regexPattern = searchWords.map((word) => `\\b${word}`).join(".*");

      // Apply the regex pattern to the name, description, and tag fields
      matchCondition = {
        $or: [
          { name: { $regex: regexPattern, $options: "i" } },
          { description: { $regex: regexPattern, $options: "i" } },
          { tag: { $elemMatch: { $regex: regexPattern, $options: "i" } } },
        ],
      };
    } else if (catName && catName !== "search") {
      // Find the category
      const category = await Category.findOne({ slug: catName });
      if (!category) {
        throw new Error("Category not found");
      }

      // Include the main category and all subcategories in the match condition
      matchCondition = {
        category: {
          $in: [category._id, ...category.children],
        },
      };
    } else {
      return;
    }

    const variantData = await Product.aggregate([
      { $match: matchCondition },
      { $unwind: "$variant" },
      { $project: { _id: 0, variant: 1 } },
    ]);

    const variants = variantData.map((data) => {
      const { variant, ...pRest } = data;
      const { _id, ...rest } = variant;
      return { variant: { id: _id.toString(), ...rest }, ...pRest };
    });

    return variants;
  } catch (err) {
    const error = handleAppError(err);
    throw Error(error.message || "Something went wrong");
  }
}

export async function getAllProducts(cat, searchParams = {}) {
  try {
    await dbConnect();
    const params = { ...searchParams };
    const catName =
      cat && cat.length > 0 ? cat.slice(-1)[0].toLowerCase() : null;

    // Find the category
    const category = catName
      ? await Category.findOne({ slug: catName }).lean()
      : null;

    let categoryIds = [];
    if (category) {
      console.log(category, "category🔥🚀💎");
      categoryIds = [category._id, ...(category.children || [])];
    }

    // Modify the query to include the category and its children if category exists
    const baseQuery =
      categoryIds.length > 0
        ? Product.find({ category: { $in: categoryIds } })
        : Product.find();

    const populatedQuery = baseQuery.populate("category", "slug").lean();

    const newSearchParams = getQueryObj(params);

    const feature = new APIFeatures(populatedQuery, newSearchParams)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const productData = await feature.query;

    const products = productData.map((product) => {
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

    return products;
  } catch (err) {
    const error = handleAppError(err);
    console.log(error, "error🔥🚀💎");
    throw new Error(error?.message || "An error occurred");
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
    const data = await handleFormData(formData, Product, id);
    const productToUpdate = {};

    for (const [key, _] of Object.entries(data)) {
      if (formData.get(key)) {
        productToUpdate[key] = data[key];
      }
    }
    if (data.variant) {
      productToUpdate.variant = data.variant;
    }

    Object.entries(productToUpdate).forEach(([key, _]) => {
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

    console.log(productToUpdate, "productToUpdate🔥🚀💎");
    // Update the product
    const productData = await Product.findOneAndUpdate(
      { _id: id },
      productToUpdate,
      {
        new: true,
        runValidators: true,
      },
    );

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

  const productData = await Product.findById(id).lean();

  if (!productData) {
    throw new Error("Product not found");
  }

  const product = productData;

  console.log(product, "productsss🔥🚀💎");
  const { _id, category, variant, ...rest } = product;

  const productVariant = variant.map((v) => {
    const { _id, ...rest } = v;
    return { id: _id.toString(), ...rest };
  });

  const productCategory = category.map((c) => ({
    id: c._id.toString(),
  }));

  return {
    id: _id.toString(),
    ...rest,
    variant: productVariant,
    category: productCategory,
  };
}

export async function getProductsByCategory(cat) {
  await dbConnect();
  const products = await Product.find({ cat }).populate("category").lean();
  return products;
}
