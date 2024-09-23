import { NextResponse } from "next/server";
import Product from "@/models/product"; // Adjust this path based on your project structure
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    let filter = {};

    // Filter by category if provided
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }).select(
        "_id",
      );
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Fetch recommended products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    console.log(products, "products 🚖🛺🚕");
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Error fetching recommendations" },
      { status: 500 },
    );
  }
}
