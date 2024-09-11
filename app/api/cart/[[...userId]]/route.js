import { Cart, CartItem } from "@/models/cart";
import User from "@/models/user";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import dbConnect from "@/lib/mongoConnection";
import AppError from "@/utils/errorClass";
import { getQuantity } from "@/utils/getFunc";
import _ from "lodash";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function GET(req, { params }) {
  await protect();
  await restrictTo("admin", "user");

  try {
    await dbConnect();

    const { userId } = params;

    const cart = await Cart.findOne({ userId }).populate({
      path: "item",
      select: "-__v",
    });

    if (!cart) {
      const newCart = await Cart.create({
        userId,
        item: [],
      });
      return NextResponse.json(
        { success: true, length: newCart.item.length, data: newCart },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { success: true, length: cart.item.length, data: cart },
      { status: 200 },
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

    const body = await req.json();
    const { userId, item: newItem } = body;
    const user = await User.findById(userId);
    let existingProduct;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if product exists or variant exists
    if (newItem.variantId) {
      existingProduct = await Product.findOne({
        _id: newItem.productId,
        "variant._id": newItem.variantId,
      });
    } else {
      existingProduct = await Product.findOne({ _id: newItem.productId });
    }

    if (!existingProduct) {
      throw new AppError("Product or variant not found", 404);
    }

    getQuantity(newItem, existingProduct);

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new AppError("Cart not found", 404);

    //check if user already has the item in cart
    const existingItem = await Cart.findOne({
      userId,
    }).populate({
      path: "item",
      match: { productId: newItem.productId },
    });

    if (existingItem) {
      // check if variant already exists
      if (
        newItem.variantId &&
        !existingItem.item.some(
          (cartItem) => cartItem.variantId === newItem.variantId,
        )
      ) {
        //check quantity
        const cartItem = await CartItem.create(newItem);
        existingItem.item.push(cartItem);
        await existingItem.save();

        return NextResponse.json(
          {
            success: true,
            length: existingItem.item.length,
            data: existingItem,
          },
          { status: 201 },
        );
      }
      // Check if original item already exists in cart
      else if (
        !newItem.variantId &&
        existingItem.item.every((cartItem) => cartItem.variantId)
      ) {
        const cartItem = await CartItem.create(newItem);
        existingItem.item.push(cartItem);
        await existingItem.save();

        return NextResponse.json(
          {
            success: true,
            length: existingItem.item.length,
            data: existingItem,
          },
          { status: 201 },
        );
      }
    }
    // new item
    else {
      const cartItem = await CartItem.create(newItem);
      cart.item.push(cartItem);
      await cart.save();
      return NextResponse.json(
        { success: true, length: cart.item.length, data: cart },
        { status: 201 },
      );
    }

    // Item exists in cart
    return NextResponse.json(
      { success: true, length: cart.item.length, data: cart },
      { status: 201 },
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  await protect();
  await restrictTo("admin", "user");
  try {
    await dbConnect();

    let existingProduct;
    const body = await req.json();
    const { userId, item: itemId, quantity, checked, selectAll, cartId } = body;

    if (
      (!selectAll && quantity === undefined && checked === undefined) ||
      (selectAll && !cartId)
    )
      throw new AppError("Invalid request", 400);

    const cartItem = await CartItem.findById(itemId);
    if (!cartItem) throw new AppError("Cart item not found", 404);

    if (typeof checked === "boolean") {
      cartItem.checked = checked;
    }

    if (cartItem.variantId) {
      existingProduct = await Product.findOne({
        "variant._id": cartItem.variantId,
      });
    } else {
      existingProduct = await Product.findOne({
        _id: cartItem.productId,
      });
    }

    if (!existingProduct) throw new AppError("Product not found", 404);

    getQuantity(body, existingProduct);

    //quantity and body.quantity is not the same, idk why
    if (quantity && quantity > 0 && typeof quantity === "number") {
      cartItem.quantity = body.quantity;
    }
    if (quantity && typeof quantity === "number" && quantity <= 0) {
      // Delete item if quantity is zero
      await cartItem.deleteOne();
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        {
          $pull: { item: itemId },
        },
        { new: true },
      );

      return NextResponse.json(
        { success: true, data: updatedCart },
        { status: 200 },
      );
    }

    if (selectAll !== undefined && typeof selectAll === "boolean") {
      await CartItem.updateMany(
        { cartId },
        {
          $set: { checked: selectAll },
        },
      );
    }

    await cartItem.save();
    const updatedCart = await Cart.findOne({ userId }).populate("item");

    return NextResponse.json(
      { success: true, data: updatedCart },
      { status: 200 },
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  await protect();
  await restrictTo("admin", "user");
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, item: itemId, deleteAll, cartId } = body;

    if (
      deleteAll !== undefined &&
      typeof deleteAll === "boolean" &&
      cartId !== undefined
    ) {
      await CartItem.deleteMany({ cartId: cartId });

      const cart = await Cart.findOne({ userId });
      cart.item = [];
      await cart.save();

      if (!cart) throw new AppError("Cart not found", 404);
      return NextResponse.json(
        {
          success: true,
          length: cart.item.length,
          data: cart,
        },
        { status: 200 },
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) throw new AppError("Cart not found", 404);

    if (!itemId) throw new AppError("Invalid request", 400);

    // Check if item exists in cart
    const existingItemIndex = cart.item.findIndex(
      (item) => item._id.toString() === itemId,
    );

    if (existingItemIndex !== -1) {
      cart.item.splice(existingItemIndex, 1);
      await cart.save();
      return NextResponse.json(
        { success: true, length: cart.item.length, data: cart },
        { status: 200 },
      );
    } else {
      throw new AppError("Item not found", 404);
    }
  } catch (error) {
    return handleAppError(error, req);
  }
}
