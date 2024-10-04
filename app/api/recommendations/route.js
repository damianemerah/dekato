import { NextResponse } from "next/server";
import Product from "@/models/product";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";

export async function GET(req) {
  try {
    await dbConnect();

    const { category, limit = "5" } = req.nextUrl.searchParams; // Use nextUrl directly instead of URL()

    let filter = {};

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }).select(
        "_id",
      );
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate("category", "name slug")
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Error fetching recommendations" },
      { status: 500 },
    );
  }
}
