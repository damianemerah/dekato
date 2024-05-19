import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import Wishlist from "@/models/wishlist";
import { Product } from "@/models/product";
import dbConnect from "@/utils/mongoConnection";
import AppError from "@/utils/errorClass";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function GET(req, { params }) {
  await protect();
  await restrictTo("admin", "user");
  try {
    await dbConnect();
    const userId = params.userId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new AppError("Wishlist not found", 404);
    }

    return NextResponse.json(
      { success: true, data: wishlist },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req) {
  await protect();
  await restrictTo("admin", "user");
  try {
    await dbConnect();

    const { productId, userId } = await req.json();

    const product = await Product.findById(productId);

    if (!product)
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );

    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      console.log("Creating new wishlist for user 😥😥😥");
      const newWishlist = await Wishlist.create({
        user: userId,
        product: [productId],
      });

      return NextResponse.json(
        {
          success: true,
          length: newWishlist.product.length,
          data: newWishlist,
        },
        { status: 200 }
      );
    }
    // Convert the products array to a Set to enforce uniqueness
    const productsSet = new Set(wishlist.product.map((p) => p._id.toString()));
    productsSet.add(productId);

    // Convert the Set back to an array
    wishlist.product = Array.from(productsSet);
    await wishlist.save();

    console.log("Product added to wishlist:", productId);
    return NextResponse.json(
      { success: true, length: wishlist.product.length, data: wishlist },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message, "error🚀🚀");
    return handleAppError(error, req);
  }
}

// route.js

export async function DELETE(req) {
  await protect();
  await restrictTo("admin", "user");
  try {
    await dbConnect();

    const { productId, userId } = await req.json();

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userId });

    console.log(wishlist);

    // If the wishlist doesn't exist, return an error
    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Remove the productId from the product array
    wishlist.product = wishlist.product.filter(
      (product) => product._id.toString() !== productId
    );

    // Save the updated wishlist
    await wishlist.save();

    return NextResponse.json(
      { success: true, data: wishlist },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}
