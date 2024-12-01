import { NextResponse } from "next/server";
import Product from "@/models/product";
import Category from "@/models/category";
import UserActivity from "@/models/userActivity";
import dbConnect from "@/lib/mongoConnection";
import { recommendationService } from "@/lib/recommendationService";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") || "4";
    const productId = searchParams.get("productId");
    const type = searchParams.get("type");
    const session = await auth();
    const userId = session?.user?.id;

    let products = [];

    if (productId && type === "similar") {
      // Get similar products for a specific product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      const userActivity = await UserActivity.findOne({ userId }).select(
        "naughtyList",
      );

      products = await product.findSimilarProducts(
        userActivity,
        parseInt(limit, 10),
      );
    } else if (userId && type === "personalized") {
      // Get personalized recommendations
      products = await recommendationService.getPersonalizedRecommendations(
        userId,
        parseInt(limit, 10),
      );
    } else {
      // Fallback to category-based or general recommendations
      let filter = { status: "active" };

      if (category) {
        const categoryDoc = await Category.findOne({ slug: category }).select(
          "_id",
        );
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }

      products = await Product.find(filter)
        .sort({ purchaseCount: -1, viewCount: -1, createdAt: -1 })
        .limit(parseInt(limit, 10))
        .populate("category", "name slug")
        .lean();
    }

    // Format the response data
    const formattedProducts = products.map((product) => {
      const { _id, ...rest } = product;
      return {
        id: _id.toString(),
        ...rest,
        category: product.category?.map((cat) => ({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
        })),
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      isPersonalized: !!userId,
      total: formattedProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching recommendations" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { productId, interactionType } = await req.json();

    // Validate request parameters
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    if (!["view", "purchase", "click"].includes(interactionType)) {
      return NextResponse.json(
        {
          error:
            "Invalid interaction type. Must be 'view', 'click' or 'purchase'",
        },
        { status: 400 },
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Track the interaction
    await recommendationService.trackProductInteraction(
      session.user.id,
      productId,
      interactionType,
    );

    return NextResponse.json({
      success: true,
      message: `Product ${interactionType} tracked successfully`,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Error tracking product interaction" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    // Get session
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get productId from request body
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add to naughty list
    await recommendationService.addToNaughtyList(session.user.id, productId);

    return NextResponse.json({
      success: true,
      message: "Product added to naughty list successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Error adding product to naughty list" },
      { status: 500 },
    );
  }
}
