import { Cart, CartItem } from "@/app/models/cart";
import User from "@/app/models/user";
import Product from "@/app/models/product";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import dbConnect from "@/utils/mongoConnection";
import mongoose from "mongoose";
import _ from "lodash";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    const cart = await Cart.findOne({ user: userId });

    console.log(cart, "cart🙏");

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { user: userId, item } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findOne({ _id: item.product });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    // If cart does not exist, create a new cart
    if (!cart) {
      console.log("Creating new cart😎😎");
      const cartItem = await CartItem.create(item);
      const newCart = await Cart.create({
        user: userId,
        item: [cartItem],
      });
      return NextResponse.json(
        { success: true, data: newCart },
        { status: 201 }
      );
    }
    //check if user already has the item in cart
    const existingItem = await Cart.findOne({
      user: userId,
      "item.product": item.product,
    });

    if (existingItem) {
      const clientItemData = { ...item };
      delete clientItemData._id;

      // check if variant already exists

      if (item.variant && Object.keys(item.variant).length > 0) {
        const hasMatchingVariant = existingItem.item.some((cartItem) => {
          const variant = { ...cartItem.variant?._doc };
          delete variant._id;
          return _.isEqual(variant, clientItemData.variant);
        });

        if (hasMatchingVariant) {
          // cart item already exists, do nothing
          return NextResponse.json(
            {
              success: true,
              length: existingItem.item.length,
              data: existingItem,
            },
            { status: 200 }
          );
        }

        // cart item variant does not exist, add it
        if (!hasMatchingVariant) {
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
      }

      // item has not variant, cart item has variant, but not product without variant, add it
      if (existingItem.item.every((cartItem) => cartItem.variant)) {
        console.log("NO VARIANTS 🚀🚀🚀🚀");

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
      // Add item to cart
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
  try {
    await dbConnect();

    const body = await req.json();
    const { user: userId, item: itemId, quantity } = body;

    const cart = await Cart.findOne({ user: userId });

    console.log("cart🚀", cart);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    console.log(quantity, itemId);

    if (!itemId ?? !quantity) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    // Check if item exists in cart

    const existingItemIndex = cart.item.findIndex(
      (item) => item._id.toString() === itemId
    );

    console.log(existingItemIndex, "existingItemIndex💎💎💎");
    if (existingItemIndex !== -1) {
      const existingItem = cart.item[existingItemIndex];

      console.log(existingItem);
      if (quantity > 0) {
        existingItem.quantity = quantity;
      } else {
        // Delete item if quantity is zero
        cart.item.splice(existingItemIndex, 1);
      }

      await cart.save();
      return NextResponse.json(
        { success: true, length: cart.item.length, data: cart },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { user: userId, item: itemId } = body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return handleAppError(error, req);
  }
}
