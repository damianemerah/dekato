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

export async function createPendingOrder(orderInputData) {
  await restrictTo('user', 'admin');

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: 'Authentication required',
    };
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
    } = orderInputData || {};

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

    // START ADDED BLOCK: Stock Verification
    for (const item of items) {
      const productId = item.product?.id || item.productId; // Handle potential structure differences
      if (!productId) {
        return {
          success: false,
          message: `Invalid product data in cart item.`,
        };
      }

      const product = await Product.findById(productId).select(
        'name quantity variant status'
      ); // Fetch necessary fields
      if (!product || product.status !== 'active') {
        return {
          success: false,
          message: `Product "${item.product?.name || productId}" is not available.`,
        };
      }

      let availableStock = product.quantity;
      if (item.variantId) {
        const variant = product.variant.find(
          (v) => v._id.toString() === item.variantId
        );
        if (!variant) {
          return {
            success: false,
            message: `Variant not found for "${product.name}".`,
          };
        }
        availableStock = variant.quantity;
      }

      if (availableStock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for "${product.name}"${item.variantId ? ' (variant)' : ''}. Available: ${availableStock}, Requested: ${item.quantity}`,
        };
      }
    }
    // END ADDED BLOCK

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
      price: item.price || 0,
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

    // Return the response structure for Paystack initialization
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
    console.error('Order creation error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create order',
    };
  } finally {
    mongoSession.endSession();
  }
}

export async function verifyAndCompleteOrder(paystackReference) {
  await restrictTo('user', 'admin');

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error('[ERROR verifyAndCompleteOrder] No userId found in session');
    redirect('/signin?callbackUrl=/cart'); // Redirect early if not authenticated
  }

  await dbConnect();

  let verificationStatus = null; // Variable to hold status after try block
  let finalOrderStatus = 'pending'; // Default in case something goes wrong before status update

  try {
    // --- Start of the operational logic ---
    await VerificationAttempt.create({
      reference: paystackReference,
      userId,
      timestamp: new Date(),
    });

    const recentAttempts = await VerificationAttempt.countDocuments({
      reference: paystackReference,
      timestamp: { $gt: new Date(Date.now() - 60000) }, // Last minute
    });

    if (recentAttempts > 5) {
      redirect(
        `/checkout/failed?reason=rate_limited&reference=${paystackReference}`
      ); // Early exit redirect
    }

    // Check if the order is already being processed (lock mechanism)
    const processingOrder = await Order.findOne({
      paymentRef: paystackReference,
      processingLock: true,
      processingLockTime: { $gt: new Date(Date.now() - 2 * 60000) }, // Lock valid for 2 minutes
    });

    if (processingOrder) {
      redirect(
        `/checkout/success?reference=${paystackReference}&status=processing`
      );
    }

    // Set a processing lock on the order
    await Order.findOneAndUpdate(
      { paymentRef: paystackReference },
      {
        processingLock: true,
        processingLockTime: new Date(),
      }
    );

    const verification = await Paystack.transaction.verify(paystackReference);
    verificationStatus = verification?.data?.status; // Store Paystack status

    if (!verification.data) {
      await Order.findOneAndUpdate(
        { paymentRef: paystackReference },
        { processingLock: false }
      );
      throw new Error('Paystack verification failed'); // Throw operational error
    }

    const order = await Order.findOne({ paymentRef: paystackReference });

    if (!order) {
      throw new Error('Order not found'); // Throw operational error
    }

    if (order.userId.toString() !== userId) {
      await Order.findOneAndUpdate(
        { paymentRef: paystackReference },
        { processingLock: false }
      );
      throw new Error('Unauthorized'); // Throw operational error
    }

    // Check if order is already processed to prevent double processing
    if (order.status === 'success') {
      // Release the lock
      await Order.findOneAndUpdate(
        { paymentRef: paystackReference },
        { processingLock: false }
      );
      redirect(
        `/checkout/success?reference=${paystackReference}&status=success`
      );
    }

    // Process the payment based on Paystack verification status
    if (verification.data.status === 'success') {
      // Update order status
      order.status = 'success';
      order.paidAt = new Date();

      await updateProductQuantity(order);

      await User.findByIdAndUpdate(order.userId, {
        $inc: { amountSpent: order.total, orderCount: 1 },
      });

      await Notification.create({
        title: 'New Order',
        message: `A new order #${order.paymentRef} has been placed for ₦${order.total}`,
        type: 'info',
        orderId: order._id,
        userId: order.userId,
      });

      // Cart clearing logic (with its own transaction)
      if (order.cartItems && order.cartItems.length > 0) {
        const cartItemIds = order.cartItems.map((item) => item.toString());

        const cartSession = await mongoose.startSession();
        await cartSession
          .withTransaction(async () => {
            const deleteResult = await CartItem.deleteMany(
              { _id: { $in: cartItemIds } },
              { session: cartSession }
            );
            await Cart.findOneAndUpdate(
              { userId: order.userId },
              { $pull: { item: { $in: cartItemIds } } },
              { session: cartSession }
            );
          })
          .catch((err) => {
            console.error(
              '[ERROR verifyAndCompleteOrder] Cart cleanup transaction failed:',
              err
            );
            // Decide if this is critical enough to throw, or just log
          })
          .finally(() => cartSession.endSession());
      } else {
        console.log('[DEBUG verifyAndCompleteOrder] No cart items to clear');
      }

      for (const item of order.product) {
        if (item.productId) {
          await recommendationService.trackProductInteraction(
            order.userId.toString(),
            item.productId.toString(),
            'purchase'
          );
        }
      }
    } else {
      // Handle non-success Paystack statuses
      const status =
        verification.data.status === 'failed' ? 'failed' : 'abandoned';

      order.status = status;
    }

    // Save final order state
    finalOrderStatus = order.status; // Update final status

    order.processingLock = false; // Release lock before final save
    await order.save();

    // Revalidate paths after successful save

    revalidatePath('/cart');
    revalidatePath('/checkout');
    revalidateTag('cart');
    revalidateTag('orders');
    revalidateTag('products');
    revalidateTag('recommendations');
    revalidateTag('recommendations-bestsellers');

    // --- End of the operational logic ---
  } catch (error) {
    // Attempt to release lock even on error
    await Order.findOneAndUpdate(
      { paymentRef: paystackReference },
      { processingLock: false }
    );
    // Redirect to failure page for operational errors
    redirect(`/checkout/failed?reason=error&reference=${paystackReference}`); // This redirect WILL be caught by Next.js
  }

  // --- Redirect logic AFTER the try...catch block ---

  // Redirect based on the final status determined within the try block
  if (verificationStatus === 'success' && finalOrderStatus === 'success') {
    redirect(`/checkout/success?reference=${paystackReference}&status=success`);
  } else if (verificationStatus) {
    redirect(
      `/checkout/success?reference=${paystackReference}&status=${finalOrderStatus}`
    );
  } else {
    // Should ideally not be reached if logic is sound, but as a fallback:

    redirect(`/checkout/failed?reason=unknown&reference=${paystackReference}`);
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
