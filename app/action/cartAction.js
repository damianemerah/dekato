'use server';

import { Cart, CartItem } from '@/models/cart';
import Product from '@/models/product';
import dbConnect from '@/app/lib/mongoConnection';
import { getQuantity } from '@/app/utils/getFunc';
import { restrictTo } from '@/app/utils/checkPermission';
import mongoose from 'mongoose';
import { revalidatePath, revalidateTag } from 'next/cache';
import { handleError } from '@/app/utils/appError';
import AppError from '@/app/utils/errorClass';

// Maximum quantity allowed per item in cart
const MAX_QUANTITY_PER_ITEM = 10;

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
        (v) => v.id.toString() === variantId?.toString()
      );

      // Create product object without _id field
      const productWithoutId = { ...product };
      delete productWithoutId._id;

      // Create variant object without _id field if variant exists
      let variantData = null;
      if (variant) {
        const variantWithoutId = { ...variant };
        delete variantWithoutId._id;
        variantData = {
          id: variant._id.toString(),
          ...variantWithoutId,
        };
      }

      return {
        id: _id.toString(),
        slug: product.slug,
        product: {
          id: product._id.toString(),
          ...productWithoutId,
          variant: variantData,
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
  // Ensure user has appropriate permissions
  await restrictTo('admin', 'user');

  let session;
  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    if (!newItem.quantity || !newItem.product) {
      throw new AppError('Missing required fields for cart item', 400);
    }

    const existingProduct = await Product.findById(newItem.product).session(
      session
    );

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    const correctQuantity = getQuantity(newItem, existingProduct);

    let cart = await Cart.findOne({ userId })
      .lean({ virtuals: true })
      .session(session);

    if (!cart) {
      cart = await createNewCart(userId, session);
    }

    // Create a query to find an existing cart item with the same product and variant
    const query = {
      product: newItem.product,
      cartId: cart._id,
      ...(newItem.variantId
        ? { variantId: newItem.variantId }
        : { variantId: { $exists: false } }),
    };

    const existingItemCart = await CartItem.findOne(query).session(session);

    if (existingItemCart) {
      // Item exists, update quantity with limit enforcement
      const newQuantity = Math.min(
        existingItemCart.quantity + correctQuantity,
        MAX_QUANTITY_PER_ITEM
      );

      // If the new quantity would exceed the maximum, show a different message
      const wasLimited =
        newQuantity < existingItemCart.quantity + correctQuantity;

      existingItemCart.quantity = newQuantity;
      await existingItemCart.save({ session });

      // Get updated cart data
      cart = await Cart.findById(cart._id)
        .session(session)
        .lean({ virtuals: true });

      // Add transaction result info
      cart.wasLimited = wasLimited;
    } else {
      // Item does not exist, create new with quantity limit
      const limitedQuantity = Math.min(correctQuantity, MAX_QUANTITY_PER_ITEM);
      const wasLimited = limitedQuantity < correctQuantity;

      const cartItem = await CartItem.create(
        [
          {
            ...newItem,
            cartId: cart._id,
            quantity: limitedQuantity,
            product: newItem.product,
          },
        ],
        { session }
      );

      cart = await Cart.findByIdAndUpdate(
        cart._id,
        { $push: { item: cartItem[0]._id } },
        { session, new: true }
      ).lean({ virtuals: true });

      // Add transaction result info
      cart.wasLimited = wasLimited;
    }

    // Revalidate all relevant paths and tags
    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidatePath('/account/wishlist');
    revalidateTag(`user-${userId}`);
    revalidateTag('cart-data');

    await session.commitTransaction();
    session.endSession();

    const formattedCart = formatCartData(cart);
    return formattedCart;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return handleError(error);
  }
}

export async function getCart(userId) {
  await restrictTo('user', 'admin');

  await dbConnect();

  const cart = await Cart.findOne({ userId })
    .populate({
      path: 'item',
      populate: {
        path: 'product',
        select:
          'name variant image slug price discount discountPrice discountDuration ',
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
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const { userId, cartItemId, product } = updateData;

    const cart = await Cart.findOne({ userId }).populate({
      path: 'item.product',
      select: 'name price discountPrice slug variant image',
    });
    if (!cart) {
      throw new AppError('Something went wrong, try again', 404);
    }
    const cartItem = cart.item.find(
      (item) => item._id.toString() === cartItemId
    );
    if (!cartItem) throw new AppError('Item not found', 404);

    const existingProduct = await Product.findById(product);

    const itemQuantity = getQuantity(updateData, existingProduct);

    cartItem.quantity = itemQuantity;
    await cartItem.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'item.product',
        select: 'name price discountPrice slug variant image',
      })
      .lean({ virtuals: true });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidateTag('cart-data');
    revalidateTag(`user-${userId}`);

    return formatCartData(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}

export async function updateCartItemChecked(userId, cartItemId, checked) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const cart = await Cart.findOne({ userId }).populate({
      path: 'item.product',
      select: 'name price discountPrice slug variant image',
    });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItem = await CartItem.findByIdAndUpdate(cartItemId, {
      checked: checked,
    });
    if (!cartItem) {
      throw new AppError('Item not found', 404);
    }

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'item.product',
        select: 'name price discountPrice slug variant image',
      })
      .lean({ virtuals: true });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidateTag('cart-data');
    revalidateTag(`user-${userId}`);

    return formatCartData(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}

export async function selectAllCart(userId, selectAll) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItems = await CartItem.updateMany(
      { cartId: cart._id },
      { checked: selectAll }
    );

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'item.product',
        select: 'name price discountPrice slug variant image',
      })
      .lean({ virtuals: true });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidateTag('cart-data');
    revalidateTag(`user-${userId}`);

    return formatCartData(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}

export async function removeFromCart(userId, cartItemId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Remove from cart items array
    await Cart.findByIdAndUpdate(cart._id, {
      $pull: { item: cartItemId },
    });

    // Delete the cart item
    await CartItem.findByIdAndDelete(cartItemId);

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'item.product',
        select: 'name price discountPrice slug variant image',
      })
      .lean({ virtuals: true });

    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidateTag('cart-data');
    revalidateTag(`user-${userId}`);

    return formatCartData(updatedCart);
  } catch (error) {
    return handleError(error);
  }
}

export async function verifyCartItemsAvailability(userId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const cart = await Cart.findOne({ userId }).populate({
      path: 'item',
      populate: {
        path: 'product',
        select: 'name quantity variant',
      },
    });

    if (!cart || !cart.item || cart.item.length === 0) {
      return { unavailableItems: [] };
    }

    const unavailableItems = [];

    for (const item of cart.item) {
      const product = item.product;

      if (!product) {
        unavailableItems.push({
          cartItemId: item._id.toString(),
          reason: 'Product no longer exists',
        });
        continue;
      }

      // Check if variant exists and has stock
      if (item.variantId) {
        const variant = product.variant?.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        if (!variant) {
          unavailableItems.push({
            cartItemId: item._id.toString(),
            reason: 'Variant no longer exists',
          });
        } else if (variant.quantity < 1) {
          unavailableItems.push({
            cartItemId: item._id.toString(),
            reason: 'Out of stock',
          });
        } else if (variant.quantity < item.quantity) {
          unavailableItems.push({
            cartItemId: item._id.toString(),
            reason: `Only ${variant.quantity} available`,
            availableQuantity: variant.quantity,
          });
        }
      } else {
        // Check main product stock
        if (product.quantity < 1) {
          unavailableItems.push({
            cartItemId: item._id.toString(),
            reason: 'Out of stock',
          });
        } else if (product.quantity < item.quantity) {
          unavailableItems.push({
            cartItemId: item._id.toString(),
            reason: `Only ${product.quantity} available`,
            availableQuantity: product.quantity,
          });
        }
      }
    }

    return { unavailableItems };
  } catch (error) {
    return handleError(error);
  }
}
