import dbConnect from "@/utils/mongoConnection";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";

export async function POST(req) {
  const originalString = "women's-shoe";
  const encodedString = encodeURIComponent(originalString);

  console.log(encodedString);
  try {
    await dbConnect();

    const body = await req.json();

    const category = await Category.create(body);

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    let filter = {};
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    if (searchParams.slug) {
      filter = { ...searchParams };
    }

    const feature = new APIFeatures(Category.find(filter), searchParams)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const category = await feature.query;

    return NextResponse.json({
      success: true,
      result: category.length,
      data: category,
    });
  } catch (error) {
    return handleAppError(error, req);
  }
}
