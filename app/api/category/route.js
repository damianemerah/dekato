import dbConnect from "@/utils/mongoConnection";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";

export async function POST(req) {
  // const originalString = "women's-shoe";
  // const encodedString = encodeURIComponent(originalString);

  // console.log(encodedString);

  try {
    await dbConnect();

    // const sampleCategories = [
    //   {
    //     name: "Clothing",
    //     description: "Fashionable clothing for all occasions",
    //     image: ["clothing_image1.jpg", "clothing_image2.jpg"],
    //     parentId: null,
    //   },
    //   {
    //     name: "Footwear",
    //     description: "Stylish footwear for men and women",
    //     image: ["footwear_image1.jpg", "footwear_image2.jpg"],
    //     parentId: null,
    //   },
    // ];

    // for (const category of sampleCategories) {
    //   await Category.create(category);
    // }

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
    console.log("Finding category 🙏🙏");

    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    console.log(searchParams, "🔥");

    const category = await Category.find(searchParams)
      .populate({
        path: "parentId",
        select: "name slug",
      })
      .populate({
        path: "products",
        select: "name price priceDiscount image",
      });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleAppError(error, req);
  }
}
