"use server";

import { Cart, CartItem } from "@/models/cart";
import Product from "@/models/product";
import dbConnect from "@/lib/mongoConnection";
import { getQuantity } from "@/utils/getFunc";
import _ from "lodash";
import { restrictTo } from "@/utils/checkPermission";
import mongoose from "mongoose";

// Helper function to format cart data
function formatCartData(cart) {
  const { _id, item } = cart;
  const formattedItems = item
    .map((cartItem) => {
      const { _id, productId, variantId, cartId, ...rest } = cartItem;

      if (!productId) {
        console.warn(`Cart item ${_id} has no associated product`);
        return null;
      }

      const variant = productId?.variant?.find(
        (v) => v._id.toString() === variantId?.toString(),
      );

      return {
        id: _id.toString(),
        slug: productId.slug,
        productId: productId._id.toString(),
        variantId: variantId?.toString(),
        cartId: cartId.toString(),
        image: variant ? variant.image : productId.image?.[0],
        ...rest,
      };
    })
    .filter(Boolean); // Remove any null items

  return {
    item: formattedItems,
    id: _id.toString(),
  };
}

// Helper function to create a new cart
async function createNewCart(userId, session) {
  const newCart = await Cart.create([{ userId, item: [] }], { session });
  return newCart[0];
}

export async function createCartItem(userId, newItem) {
  await restrictTo("admin", "user");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    if (
      !newItem.quantity ||
      !newItem.productId ||
      !newItem.name ||
      !newItem.price
    ) {
      throw new Error("Missing required fields for cart item");
    }

    const existingProduct = await Product.findById(newItem.productId).session(
      session,
    );
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const correctQuantity = getQuantity(newItem, existingProduct);

    let cart = await Cart.findOne({ userId }).lean().session(session);

    if (!cart) {
      cart = await createNewCart(userId, session);
    }

    const query = {
      productId: newItem.productId,
      cartId: cart._id,
      ...(newItem.variantId
        ? { variantId: newItem.variantId }
        : { variantId: { $exists: false } }),
    };

    const existingItemCart = await CartItem.findOne(query).session(session);

    if (existingItemCart) {
      existingItemCart.quantity += correctQuantity;
      await existingItemCart.save({ session });

      // throw new Error("Item not added to cart or already exists");
    } else {
      const cartItem = await CartItem.create(
        [
          {
            ...newItem,
            cartId: cart._id,
            quantity: correctQuantity,
          },
        ],
        { session },
      );

      cart = await Cart.findByIdAndUpdate(
        cart._id,
        { $push: { item: cartItem[0]._id } },
        { session, new: true },
      ).lean();
    }

    await session.commitTransaction();
    return formatCartData(cart);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function getCart(userId) {
  await dbConnect();

  // Find the cart and populate the product details and variants
  const cart = await Cart.findOne({ userId }).lean();

  if (!cart) {
    return createNewCart(userId);
  }

  return formatCartData(cart);
}

export async function updateCartItemQuantity(updateData) {
  await restrictTo("admin", "user");
  await dbConnect();

  const { userId, cartItemId, productId, quantity } = updateData;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Something went wrong, try again");
  }
  const cartItem = cart.item.find((item) => item._id.toString() === cartItemId);
  if (!cartItem) throw new Error("Item not found");

  const product = await Product.findById(productId);

  const itemQuantity = getQuantity(updateData, product);

  cartItem.quantity = itemQuantity;
  await cartItem.save();

  const updatedCart = await Cart.findById(cart._id).lean();

  return formatCartData(updatedCart);
}

export async function updateCartItemChecked(userId, cartItemId, checked) {
  await restrictTo("admin", "user");
  await dbConnect();

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await CartItem.findByIdAndUpdate(cartItemId, {
    checked: checked,
  });
  if (!cartItem) {
    throw new Error("Item not found");
  }

  const updatedCart = await Cart.findById(cart._id).lean();

  return formatCartData(updatedCart);
}

export async function selectAllCart(userId, selectAll) {
  await restrictTo("admin", "user");
  await dbConnect();

  // Ensure that selectAll is a boolean
  if (typeof selectAll !== "boolean") {
    throw new Error("Invalid value for selectAll");
  }

  // Find the user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Extract the CartItem ids
  const cartItemIds = cart.item.map((item) => item._id);

  // Update the checked status for all CartItems in the cart
  await CartItem.updateMany(
    { _id: { $in: cartItemIds } },
    { $set: { checked: selectAll } },
  );

  // Fetch the updated cart with items
  const updatedCart = await Cart.findById(cart._id).lean();

  return formatCartData(updatedCart);
}

export async function removeFromCart(userId, cartItemId) {
  await restrictTo("admin", "user");
  await dbConnect();

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = cart.item.find((item) => item._id.toString() === cartItemId);
  if (!cartItem) {
    throw new Error("Item not found");
  }

  await cartItem.deleteOne();
  await cart.save();

  return null;
}
