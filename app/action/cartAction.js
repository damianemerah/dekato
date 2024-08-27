import { Cart, CartItem } from "@/models/cart";
import User from "@/models/user";
import Product from "@/models/product";
import dbConnect from "@/lib/mongoConnection";
import getQuantity from "@/utils/getQuantity";
import _ from "lodash";
import { restrictTo } from "@/utils/checkPermission";

export async function createCartItem(userId, newItem) {
  await restrictTo("admin", "user");

  await dbConnect();

  let existingProduct;

  if (!newItem.quantity) {
    throw new Error("Quantity is required");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const newCart = createNewCart(userId);

    const existingProduct = await Product.findById(newItem.product);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const quantity = getQuantity(newItem.quantity, existingProduct);

    const cartItem = await CartItem.create({ ...newItem, quantity });

    newCart.item.push(cartItem);

    await newCart.save();

    return cartItem;
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
    throw new Error("Product or variant not found");
  }
  const correctQuantity = getQuantity(newItem.quantity, existingProduct);

  //check if user already has the item in cart
  const existingItemCart = await Cart.findOne({
    userId,
  }).populate({
    path: "item",
    match: { productId: newItem.productId },
  });

  if (existingItemCart) {
    // check if variant already exists
    if (
      newItem.variantId &&
      !existingItemCart.item.some(
        (cartItem) => cartItem.variantId === newItem.variantId,
      )
    ) {
      //check quantity
      const cartItem = await CartItem.create({ newItem, correctQuantity });
      existingItemCart.item.push(cartItem);
      await existingItemCart.save();

      return cartItem;
    }
    // Check if original item already exists in cart
    else if (
      !newItem.variantId &&
      existingItemCart.item.every((cartItem) => cartItem.variantId)
    ) {
      //check quantity
      const cartItem = await CartItem.create({ newItem, correctQuantity });
      existingItemCart.item.push(cartItem);
      await existingItemCart.save();

      return cartItem;
    }
  } else {
    const cartItem = await CartItem.create({ newItem, correctQuantity });
    cart.item.push(cartItem);
    await cart.save();

    return cartItem;
  }

  throw new Error("Item not added to cart or already exists");
}

export async function getCart(userId) {
  await restrictTo("admin", "user");

  await dbConnect();

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    createNewCart(userId);
  }

  return cart;
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

  return cartItem;
}

export async function selectAllCart(userId, selectAll) {
  await restrictTo("admin", "user");
  await dbConnect();

  if (typeof selectAll !== "boolean") {
    throw new Error("Invalid value for selectAll");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }
  cart.item.forEach((item) => {
    item.checked = selectAll;
  });
  cart.save();

  return item;
}

function createNewCart(userId) {
  return Cart.create({
    userId,
    item: [],
  });
}
