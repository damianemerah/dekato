import dbConnect from "@/utils/mongoConnection";
import { Product } from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";
import AppError from "@/utils/errorClass";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";
import { handleFormData } from "@/utils/handleFormData";
import Category from "@/app/models/category";
import { deleteFiles } from "@/utils/s3Func";

export async function POST(req) {
  try {
    // const session = await getServerSession(options);
    // console.log(session, "🚀🚀🚀");
    // if (!session) {
    //   console.log("You need to be logged in to create a product🚀🚀🚀");
    // } else {
    //   console.log("You are logged in🚀🚀🚀");
    // }
    await dbConnect();

    const formData = await req.formData();
    const obj = await handleFormData(formData);
    const category = await Category.findById(obj.category);

    if (!category) throw new AppError("Category not found", 404);

    const product = await Product.create(obj);

    if (!product) throw new AppError("Product not created", 400);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    const feature = new APIFeatures(Product.find(), searchParams)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const product = await feature.query;

    return NextResponse.json({
      success: true,
      result: product.length,
      data: product,
    });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    //remove params from the functions
    const formData = await req.formData();
    const id = JSON.parse(formData.get("data")).productId;
    const body = await handleFormData(formData, Product, id);

    // Find the existing product
    const existingProduct = await Product.findById(id);

    // Create a map of existing variant IDs to their corresponding variant objects
    const existingVariantsMap = new Map(
      existingProduct.variant.map((variant) => [
        variant._id.toString(),
        variant,
      ])
    );

    // Update existing variants and collect new variants
    const updatedVariants = body.variant.map((newVariant) => {
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
    body.variant = updatedVariants;

    // Update the product
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    await deleteFiles(product.image);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
