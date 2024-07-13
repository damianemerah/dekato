"use server";

import { Product } from "@/models/product";
import APIFeatures from "@/utils/apiFeatures";
import { handleFormData } from "@/utils/handleFormData";
import Category from "@/models/category";
import { deleteFiles } from "@/lib/s3Func";
import { protect, restrictTo } from "@/utils/checkPermission";
import dbConnect from "@/lib/mongoConnection";
import { includePriceObj } from "@/utils/searchWithPrice";

export async function getAllProducts(cat, searchParams = {}) {
  try {
    searchParams.cat = cat;
    const newSearchParams = includePriceObj(searchParams);

    await dbConnect();

    const feature = new APIFeatures(Product.find().lean(), newSearchParams)
      .sort()
      .limitFields()
      .paginate()
      .filter();

    const products = await feature.query;

    console.log(products, "products🚀🚀🚀");

    for (let i = 0; i < products.length; i++) {
      products[i]._id = products[i]._id.toString();

      if (products[i].category) {
        products[i].category = products[i].category.toString();
      }
    }

    return products;
  } catch (error) {
    return error;
  }
}

export async function createProduct(formData) {
  // try {
  await restrictTo("admin");
  await dbConnect();

  console.log("formData⭐ed⭐", formData.get("email"));
  return {};
  const obj = await handleFormData(formData);
  const category = await Category.findById(obj.category);

  if (!category) throw new AppError("Category not found", 404);

  const product = await Product.create(obj);

  if (!product) throw new AppError("Product not created", 400);

  return NextResponse.json({ success: true, data: product }, { status: 201 });
  // } catch (error) {
  //   console.log(error);
  // }
}
