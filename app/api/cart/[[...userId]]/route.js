import { Cart, CartItem } from "@/models/cart";
import User from "@/models/user";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import dbConnect from "@/utils/mongoConnection";
import AppError from "@/utils/errorClass";
import checkQuantity from "@/utils/checkQuantity";
import _ from "lodash";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function GET(req, { params }) {
  await protect();
  await restrictTo("admin", "user");

  try {
    await dbConnect();

    const { userId } = params;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "item",
      select: "-__v",
    });

    if (!cart) {
      const newCart = await Cart.create({
        user: userId,
        item: [],
      });
      return NextResponse.json(
        { success: true, length: newCart.item.length, data: newCart },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: true, length: cart.item.length, data: cart },
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

    const body = await req.json();
    const { user: userId, item } = body;
    const user = await User.findById(userId);
    let existingProduct;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if product exists or variant exists
    if (item.variantId) {
      existingProduct = await Product.findOne({
        _id: item.product,
        "variant._id": item.variantId,
      });
    } else {
      existingProduct = await Product.findOne({ _id: item.product });
    }

    if (!existingProduct) {
      throw new AppError("Product or variant not found", 404);
    }

    checkQuantity(item, existingProduct);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Cart not found", 404);

    //check if user already has the item in cart
    const existingItem = await Cart.findOne({
      user: userId,
    }).populate({
      path: "item",
      match: { product: item.product },
    });

    if (existingItem) {
      // check if variant already exists
      if (
        item.variantId &&
        !existingItem.item.some(
          (cartItem) => cartItem.variantId === item.variantId
        )
      ) {
        //check quantity
        const cartItem = await CartItem.create(item);
        existingItem.item.push(cartItem);
        await existingItem.save();

        return NextResponse.json(
          {
            success: true,
            length: existingItem.item.length,
            data: existingItem,
          },
          { status: 201 }
        );
      }
      // Check if item already exists in cart
      else if (
        !item.variantId &&
        existingItem.item.every((cartItem) => cartItem.variantId)
      ) {
        const cartItem = await CartItem.create(item);
        existingItem.item.push(cartItem);
        await existingItem.save();

        return NextResponse.json(
          {
            success: true,
            length: existingItem.item.length,
            data: existingItem,
          },
          { status: 201 }
        );
      }
    } else {
      const cartItem = await CartItem.create(item);
      cart.item.push(cartItem);
      await cart.save();
      return NextResponse.json(
        { success: true, length: cart.item.length, data: cart },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: true, length: cart.item.length, data: cart },
      { status: 201 }
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
    const {
      user: userId,
      item: itemId,
      quantity,
      checked,
      selectAll,
      cartId,
    } = body;

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
        _id: cartItem.product,
      });
    }

    if (!existingProduct) throw new AppError("Product not found", 404);

    checkQuantity(body, existingProduct);

    //quantity and body.quantity is not the same, idk why
    if (quantity && quantity > 0 && typeof quantity === "number") {
      cartItem.quantity = body.quantity;
    }
    if (quantity && typeof quantity === "number" && quantity <= 0) {
      // Delete item if quantity is zero
      await cartItem.deleteOne();
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        {
          $pull: { item: itemId },
        },
        { new: true }
      );

      return NextResponse.json(
        { success: true, data: updatedCart },
        { status: 200 }
      );
    }

    if (selectAll !== undefined && typeof selectAll === "boolean") {
      await CartItem.updateMany(
        { cartId },
        {
          $set: { checked: selectAll },
        }
      );
    }

    await cartItem.save();
    const updatedCart = await Cart.findOne({ user: userId }).populate("item");

    return NextResponse.json(
      { success: true, data: updatedCart },
      { status: 200 }
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
    const { user: userId, item: itemId, deleteAll, cartId } = body;

    if (
      deleteAll !== undefined &&
      typeof deleteAll === "boolean" &&
      cartId !== undefined
    ) {
      await CartItem.deleteMany({ cartId: cartId });

      const cart = await Cart.findOne({ user: userId });
      cart.item = [];
      await cart.save();

      if (!cart) throw new AppError("Cart not found", 404);
      return NextResponse.json(
        {
          success: true,
          length: cart.item.length,
          data: cart,
        },
        { status: 200 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) throw new AppError("Cart not found", 404);

    if (!itemId) throw new AppError("Invalid request", 400);

    // Check if item exists in cart
    const existingItemIndex = cart.item.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (existingItemIndex !== -1) {
      cart.item.splice(existingItemIndex, 1);
      await cart.save();
      return NextResponse.json(
        { success: true, length: cart.item.length, data: cart },
        { status: 200 }
      );
    } else {
      throw new AppError("Item not found", 404);
    }
  } catch (error) {
    return handleAppError(error, req);
  }
}
