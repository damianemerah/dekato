import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";
import AppError from "@/utils/errorClass";
import { uploadFiles } from "@/utils/s3Func";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";
import { handleFormData } from "@/utils/handleFormData";
import Category from "@/app/models/category";

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

    console.log(obj.category, "🚀🚀🚀🚀🚀");

    const category = await Category.findById(obj.category);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    console.log(obj, "🚀🚀🚀🚀🚀");
    const product = await Product.create(obj);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not created" },
        { status: 400 }
      );
    }

    console.log("Product created successfully🚀🚀🚀", product.currentPrice);

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
