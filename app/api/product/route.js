import dbConnect from "@/utils/mongoConnection";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import APIFeatures from "@/utils/apiFeatures";

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const product = await Product.create(body);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
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
      filter = { slug: searchParams.slug };
    }

    const feature = new APIFeatures(Product.find(filter), searchParams)
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
