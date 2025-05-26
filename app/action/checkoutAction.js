'use server';

import { startSession } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { auth } from '@/app/lib/auth';
import { Cart, CartItem } from '@/models/cart';
import Order from '@/models/order';
import Address from '@/models/address';
import Payment from '@/models/payment';
import dbConnect from '@/app/lib/mongoConnection';
import { restrictTo } from '@/app/utils/checkPermission';
import AppError from '@/app/utils/errorClass';
import { omit } from 'lodash';
import User from '@/models/user';
import Product from '@/models/product';
import Notification from '@/models/notification';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
import { recommendationService } from '@/app/lib/recommendationService';
import mongoose from 'mongoose';
import { VerificationAttempt } from '@/models/verificationAttempt';

// Initialize nanoid for reference generation
const nanoId = customAlphabet('0123456789', 6);

/**
 * Generates a unique payment reference
 * @returns {Promise<string>} A unique payment reference
 */
async function generateUniqueReference() {
  let payId;
  let isUnique = false;

  while (!isUnique) {
    payId = nanoId();
    // Check if reference already exists in orders
    const existingOrder = await Order.findOne({ paymentRef: payId });
    isUnique = !existingOrder;
  }

  return payId;
}

export async function getCheckoutData(userId) {
  await restrictTo('user', 'admin');

  await dbConnect();

  const cart = await Cart.findOne({ userId })
    .populate({
      path: 'item',
      populate: {
        path: 'product',
        select: 'slug variant image name price discount discountPrice',
      },
    })
    .lean({ virtuals: true });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const checkedItems = cart.item.filter((item) => item.checked);

  const formattedItems = checkedItems.map(formatCartItem);

  const itemCount = checkedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return {
    userId,
    items: formattedItems,
    itemCount,
    totalPrice: cart.totalPrice,
  };
}

export async function initiateCheckout(checkoutData) {
  await restrictTo('user', 'admin');

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  await dbConnect();

  const mongoSession = await startSession();
  try {
    mongoSession.startTransaction();

    // Destructure with default values to avoid null/undefined errors
    const {
      shippingMethod = '',
      address,
      items = [],
      amount = 0,
      email = '',
      saveCard = false,
      cardId,
    } = checkoutData || {};

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('No items in cart', 400);
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new AppError('Invalid amount', 400);
    }

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Validate shipping method and address
    if (shippingMethod?.toLowerCase() === 'delivery' && !address) {
      throw new AppError('Address is required for delivery', 400);
    }

    if (shippingMethod?.toLowerCase() === 'delivery') {
      const userAddress = await Address.findOne({
        userId,
        _id: address.id,
        isDefault: true,
      }).session(mongoSession);

      if (!userAddress) {
        throw new AppError('User address not found', 404);
      }
    }

    const payId = await generateUniqueReference();
    const totalItems = items.reduce(
      (total, item) => total + (item.quantity ? parseInt(item.quantity) : 0),
      0
    );

    // Sanitize product data to avoid circular references
    const orderProducts = items.map((item) => ({
      productId: item.product?.id,
      name: item.product?.name || 'Unknown product',
      price: item.currentPrice || 0,
      image: item.image || null,
      quantity: item.quantity || 1,
      option: item.option || {},
      variantId: item.variantId,
    }));

    const orderData = {
      userId: userId,
      product: orderProducts,
      paymentRef: payId,
      cartItems: items.map((item) => item.id),
      total: amount,
      totalItems,
      status: 'pending', // Explicitly set status to pending
      shippingMethod: shippingMethod?.toLowerCase(),
      address:
        shippingMethod?.toLowerCase() === 'delivery' ? address.id : undefined,
    };

    // Session require array of objects
    const order = await Order.create([orderData], { session: mongoSession });

    const createdOrder = order[0];

    if (!order) {
      throw new AppError('Order could not be created', 500);
    }

    await mongoSession.commitTransaction();

    // Return the modified response structure
    return {
      success: true,
      orderId: createdOrder._id.toString(),
      amount: amount, // Original amount (not converted to kobo)
      email: email,
      reference: payId,
      message: 'Pending order created.',
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    console.error('Checkout error:', error);
    return {
      success: false,
      message: error.message || 'Checkout failed',
    };
  } finally {
    mongoSession.endSession();
  }
}

/**
 * Updates product quantities after a successful order
 * @param {Object} order - The order document
 */
async function updateProductQuantity(order) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.product) {
      if (!item.productId) {
        continue;
      }

      // Check if this is a variant product
      if (item.variantId) {
        // Use atomic operations to update the variant quantity and check stock status
        const result = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            'variant._id': item.variantId,
          },
          {
            $inc: {
              'variant.$.quantity': -item.quantity,
              sold: item.quantity,
              purchaseCount: 1,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!result) {
          continue;
        }

        // Check if all variants are out of stock and update status if needed
        const allVariantsOutOfStock = result.variant.every(
          (v) => v.quantity <= 0
        );
        if (allVariantsOutOfStock) {
          await Product.findByIdAndUpdate(
            item.productId,
            { status: 'outofstock' },
            { session }
          );
        }
      } else {
        const result = await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              quantity: -item.quantity,
              sold: item.quantity,
              purchaseCount: 1,
            },
            // Set status to outofstock if quantity will be zero or less after this update
            $cond: [
              { $lte: [{ $subtract: ['$quantity', item.quantity] }, 0] },
              { $set: { status: 'outofstock' } },
              {},
            ],
          },
          {
            new: true,
            session,
          }
        );

        if (!result) {
          continue;
        }

        // Additional check for out of stock status
        if (result.quantity <= 0 && result.status !== 'outofstock') {
          await Product.findByIdAndUpdate(
            item.productId,
            { status: 'outofstock' },
            { session }
          );
        }
      }
    }

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();

    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}

function formatCartItem(cartItem) {
  const { _id, product, variantId, cartId, ...rest } = cartItem;
  const variant = product.variant?.find(
    (v) => v._id.toString() === variantId?.toString()
  );

  const price = variant ? variant.price : product.price;
  const discountPrice = product.isDiscounted
    ? variant
      ? variant.discountPrice
      : product.discountPrice
    : null;

  return {
    id: _id.toString(),
    option: cartItem.option,
    price,
    discountPrice,
    product: {
      id: product._id.toString(),
      ...omit(product, ['_id']),
    },
    variantId: variantId?.toString(),
    cartId: cartId.toString(),
    image: variant ? variant.image : product.image?.[0],
    ...rest,
  };
}

export async function verifyOrderPayment(reference, userId) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const verification = await Paystack.transaction.verify(reference);

    if (!verification.data) {
      return { success: false, message: 'Payment verification failed' };
    }

    const {
      reference: paymentRef,
      metadata: { orderId },
    } = verification.data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Only allow users to verify their own orders
    if (order.userId.toString() !== userId) {
      throw new AppError('Unauthorized', 401);
    }

    return {
      success: true,
      message: 'Payment verified',
      status: verification.data.status,
      order: {
        id: order._id.toString(),
        status: order.status,
        paymentRef: order.paymentRef,
        total: order.total,
      },
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    };
  }
}
