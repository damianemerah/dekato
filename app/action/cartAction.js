"use server";

import { Cart, CartItem } from "@/models/cart";
import Product from "@/models/product";
import dbConnect from "@/lib/mongoConnection";
import { getQuantity } from "@/utils/getFunc";
import _ from "lodash";
import { restrictTo } from "@/utils/checkPermission";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";

// Helper function to format cart data
function formatCartData(cart) {
  const { _id, item, totalPrice, totalItems, amountSaved } = cart;

  const formattedItems = item
    .map((cartItem) => {
      const { _id, product, variantId, cartId, ...rest } = cartItem;

      if (!product) {
        console.warn(`Cart item ${_id} has no associated product`);
        return null;
      }

      const variant = product?.variant?.find(
        (v) => v.id.toString() === variantId?.toString(),
      );

      return {
        id: _id.toString(),
        slug: product.slug,
        product: {
          id: product._id.toString(),
          ..._.omit(product, ["_id"]),
          variant: variant
            ? {
                id: variant._id.toString(),
                ..._.omit(variant, ["_id"]),
              }
            : null,
        },
        variantId: variantId?.toString(),
        cartId: cartId.toString(),
        image: variant ? variant.image : product.image?.[0],
        ...rest,
      };
    })
    .filter(Boolean);

  return {
    item: formattedItems,
    id: _id.toString(),
    totalPrice,
    totalItems,
    amountSaved,
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

    if (!newItem.quantity || !newItem.product) {
      throw new Error("Missing required fields for cart item");
    }

    const existingProduct = await Product.findById(newItem.product).session(
      session,
    );

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const correctQuantity = getQuantity(newItem, existingProduct);

    let cart = await Cart.findOne({ userId })
      .lean({ virtuals: true })
      .session(session);

    if (!cart) {
      cart = await createNewCart(userId, session);
    }

    const query = {
      product: newItem.product,
      cartId: cart._id,
      ...(newItem.variantId
        ? { variantId: newItem.variantId }
        : { variantId: { $exists: false } }),
    };

    const existingItemCart = await CartItem.findOne(query).session(session);

    if (existingItemCart) {
      existingItemCart.quantity += correctQuantity;
      await existingItemCart.save({ session });
    } else {
      const cartItem = await CartItem.create(
        [
          {
            ...newItem,
            cartId: cart._id,
            quantity: correctQuantity,
            product: newItem.product,
          },
        ],
        { session },
      );

      cart = await Cart.findByIdAndUpdate(
        cart._id,
        { $push: { item: cartItem[0]._id } },
        { session, new: true },
      ).lean({ virtuals: true });
    }

    // revalidateTag("checkout-data");
    // revalidatePath("/checkout");

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

  const cart = await Cart.findOne({ userId })
    .populate({
      path: "item",
      populate: {
        path: "product",
        select:
          "name variant image slug price discount discountPrice discountDuration",
      },
    })
    .lean({ virtuals: true });

  if (!cart) {
    return createNewCart(userId);
  }

  const data = formatCartData(cart);
  return data;
}

export async function updateCartItemQuantity(updateData) {
  await restrictTo("admin", "user");
  await dbConnect();

  const { userId, cartItemId, product } = updateData;

  const cart = await Cart.findOne({ userId }).populate({
    path: "item.product",
    select: "name price discountPrice slug variant image",
  });
  if (!cart) {
    throw new Error("Something went wrong, try again");
  }
  const cartItem = cart.item.find((item) => item._id.toString() === cartItemId);
  if (!cartItem) throw new Error("Item not found");

  const existingProduct = await Product.findById(product);

  const itemQuantity = getQuantity(updateData, existingProduct);

  cartItem.quantity = itemQuantity;
  await cartItem.save();

  const updatedCart = await Cart.findById(cart._id)
    .populate({
      path: "item.product",
      select: "name price discountPrice slug variant image",
    })
    .lean({ virtuals: true });

  // revalidateTag("checkout-data");
  // revalidatePath("/checkout");
  revalidatePath("/cart");
  return formatCartData(updatedCart);
}

export async function updateCartItemChecked(userId, cartItemId, checked) {
  await restrictTo("admin", "user");
  await dbConnect();

  const cart = await Cart.findOne({ userId }).populate({
    path: "item.product",
    select: "name price discountPrice slug variant image",
  });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = await CartItem.findByIdAndUpdate(cartItemId, {
    checked: checked,
  });
  if (!cartItem) {
    throw new Error("Item not found");
  }

  const updatedCart = await Cart.findById(cart._id)
    .populate({
      path: "item.product",
      select: "name price discountPrice slug variant image",
    })
    .lean({ virtuals: true });

  // revalidateTag("checkout-data");
  // revalidatePath("/checkout");

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
  const updatedCart = await Cart.findById(cart._id)
    .populate({
      path: "item.product",
      select: "name price discountPrice slug variant image",
    })
    .lean({ virtuals: true });
  // revalidateTag("checkout-data");
  // revalidatePath("/checkout");

  return formatCartData(updatedCart);
}

export async function removeFromCart(userId, cartItemId) {
  await restrictTo("admin", "user");
  await dbConnect();

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find the index of the cart item to remove
  const itemIndex = cart.item.findIndex(
    (item) => item._id.toString() === cartItemId,
  );
  if (itemIndex === -1) {
    throw new Error("Item not found");
  }

  // Remove the item from the cart's item array
  cart.item.splice(itemIndex, 1);

  // Delete the CartItem document
  await CartItem.findByIdAndDelete(cartItemId);

  // Save the updated cart
  await cart.save();

  // Fetch the updated cart with items
  const updatedCart = await Cart.findById(cart._id)
    .populate({
      path: "item.product",
      select: "name price discountPrice slug variant image",
    })
    .lean({ virtuals: true });

  // revalidateTag("checkout-data");
  // revalidatePath("/checkout");

  return formatCartData(updatedCart);
}
