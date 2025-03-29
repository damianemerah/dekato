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
import { revalidatePath } from 'next/cache';
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
import { recommendationService } from '@/app/lib/recommendationService';

// Initialize nanoid for reference generation
const nanoId = customAlphabet('0123456789', 6);

export async function getCheckoutData(userId) {
  await restrictTo('user', 'admin');

  try {
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
  } catch (error) {
    console.error('Error in getCheckoutData:', error);
    throw error;
  }
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

    const payId = nanoId();
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

    const payId = nanoId();
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
  console.log(
    `[DEBUG verifyAndCompleteOrder] Entered with reference: ${paystackReference}`
  );
  await restrictTo('user', 'admin');

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    console.error('[ERROR verifyAndCompleteOrder] No userId found in session');
    return {
      success: false,
      message: 'Authentication required',
    };
  }

  console.log(`[DEBUG verifyAndCompleteOrder] Authenticated user: ${userId}`);
  await dbConnect();

  try {
    // Verify the transaction with Paystack
    console.log(
      `[DEBUG verifyAndCompleteOrder] Calling Paystack.transaction.verify for ref: ${paystackReference}`
    );
    const verification = await Paystack.transaction.verify(paystackReference);
    console.log(
      `[DEBUG verifyAndCompleteOrder] Paystack verification status: ${verification?.data?.status}, Reference: ${verification?.data?.reference}`
    );

    if (!verification.data) {
      console.error(
        '[ERROR verifyAndCompleteOrder] Paystack verification returned no data.'
      );
      return { success: false, message: 'Payment verification failed' };
    }

    // Find the order by payment reference
    console.log(
      `[DEBUG verifyAndCompleteOrder] Finding order with paymentRef: ${paystackReference}`
    );
    const order = await Order.findOne({ paymentRef: paystackReference });

    if (!order) {
      console.error(
        `[ERROR verifyAndCompleteOrder] Order not found for ref: ${paystackReference}`
      );
      return { success: false, message: 'Order not found' };
    }

    console.log(
      `[DEBUG verifyAndCompleteOrder] Found order ID: ${order._id}, Current status: ${order.status}, UserID: ${order.userId}`
    );

    // Security check: ensure the user owns this order
    if (order.userId.toString() !== userId) {
      console.error(
        `[ERROR verifyAndCompleteOrder] User mismatch: Order User ${order.userId}, Session User ${userId}`
      );
      return { success: false, message: 'Unauthorized' };
    }

    // Check if order is already processed to prevent double processing
    if (order.status === 'success') {
      console.log(
        `[DEBUG verifyAndCompleteOrder] Order ${order._id} already processed.`
      );
      return {
        success: true,
        message: 'Order has already been processed',
        status: 'success',
      };
    }

    // Process the payment based on Paystack verification status
    if (verification.data.status === 'success') {
      console.log(
        `[DEBUG verifyAndCompleteOrder] Processing successful payment for order ${order._id}`
      );

      // Update order status
      order.status = 'success';
      order.paidAt = new Date();
      console.log(
        `[DEBUG verifyAndCompleteOrder] Updated order status to 'success' and set paidAt to ${order.paidAt}`
      );

      // Update product quantities and status
      console.log(
        '[DEBUG verifyAndCompleteOrder] Updating product quantities...'
      );
      await updateProductQuantity(order);
      console.log('[DEBUG verifyAndCompleteOrder] Product quantities updated.');

      // Update user stats
      console.log(
        `[DEBUG verifyAndCompleteOrder] Updating user stats for user ${order.userId}`
      );
      const userUpdateResult = await User.findByIdAndUpdate(order.userId, {
        $inc: {
          amountSpent: order.total,
          orderCount: 1,
        },
      });
      console.log('[DEBUG verifyAndCompleteOrder] User stats updated.');

      // Create notification for admin
      console.log('[DEBUG verifyAndCompleteOrder] Creating admin notification');
      const notification = await Notification.create({
        title: 'New Order',
        message: `A new order #${order.paymentRef} has been placed for ₦${order.total}`,
        type: 'info',
        orderId: order._id,
        userId: order.userId,
      });
      console.log(
        `[DEBUG verifyAndCompleteOrder] Admin notification created: ${notification._id}`
      );

      // Clear the cart items
      if (order.cartItems && order.cartItems.length > 0) {
        const cartItemIds = order.cartItems.map((item) => item.toString());
        console.log(
          `[DEBUG verifyAndCompleteOrder] Clearing ${cartItemIds.length} cart items`
        );

        // Delete cart items
        const deleteResult = await CartItem.deleteMany({
          _id: { $in: cartItemIds },
        });
        console.log(
          `[DEBUG verifyAndCompleteOrder] Cart items deleted: ${deleteResult.deletedCount} items`
        );

        // Update cart totals
        console.log(
          `[DEBUG verifyAndCompleteOrder] Finding cart for user ${order.userId}`
        );
        const cart = await Cart.findOne({ userId: order.userId });
        if (cart) {
          console.log(
            `[DEBUG verifyAndCompleteOrder] Updating cart ${cart._id}`
          );
          // Recalculate cart totals without the ordered items
          cart.recalculateTotals = true;
          await cart.save();
          console.log(
            '[DEBUG verifyAndCompleteOrder] Cart updated successfully'
          );
        } else {
          console.log('[DEBUG verifyAndCompleteOrder] No cart found for user');
        }
      } else {
        console.log('[DEBUG verifyAndCompleteOrder] No cart items to clear');
      }

      // Track product purchases for recommendations
      console.log(
        '[DEBUG verifyAndCompleteOrder] Tracking product interactions for recommendations'
      );
      for (const item of order.product) {
        if (item.productId) {
          console.log(
            `[DEBUG verifyAndCompleteOrder] Tracking purchase for product ${item.productId}`
          );
          await recommendationService.trackProductInteraction(
            order.userId.toString(),
            item.productId.toString(),
            'purchase'
          );
        }
      }
      console.log(
        '[DEBUG verifyAndCompleteOrder] Product interactions tracked'
      );
    } else {
      // Payment failed or was abandoned
      const status =
        verification.data.status === 'failed' ? 'failed' : 'abandoned';
      console.log(
        `[DEBUG verifyAndCompleteOrder] Payment ${status}, updating order status`
      );
      order.status = status;
    }

    // Save the updated order
    console.log(
      `[DEBUG verifyAndCompleteOrder] Attempting to save order ${order._id} with status: ${order.status}`
    );
    await order.save();
    console.log(
      `[DEBUG verifyAndCompleteOrder] Order ${order._id} saved successfully.`
    );

    // Revalidate paths
    console.log(
      `[DEBUG verifyAndCompleteOrder] Revalidating paths: /cart, /checkout`
    );
    revalidatePath('/cart');
    revalidatePath('/checkout');

    const returnValue = {
      success: verification.data.status === 'success',
      message:
        verification.data.status === 'success'
          ? 'Payment verified and order completed successfully'
          : `Payment ${verification.data.status}`,
      status: verification.data.status,
    };
    console.log(
      '[DEBUG verifyAndCompleteOrder] Returning:',
      JSON.stringify(returnValue)
    );
    return returnValue;
  } catch (error) {
    console.error(
      '[ERROR verifyAndCompleteOrder] Caught error:',
      error.message,
      error.stack
    );
    return {
      success: false,
      message:
        'Payment verification failed: ' + (error.message || 'Unknown error'),
      error: error.message,
    };
  }
}

/**
 * Updates product quantities after a successful order
 * @param {Object} order - The order document
 */
async function updateProductQuantity(order) {
  console.log(`[DEBUG updateProductQuantity] Entered for order: ${order._id}`);
  try {
    for (const item of order.product) {
      if (!item.productId) {
        console.log(
          '[DEBUG updateProductQuantity] Skipping item without productId'
        );
        continue;
      }

      console.log(
        `[DEBUG updateProductQuantity] Processing product: ${item.productId}, quantity: ${item.quantity}`
      );
      const product = await Product.findById(item.productId);
      if (!product) {
        console.log(
          `[DEBUG updateProductQuantity] Product not found: ${item.productId}`
        );
        continue;
      }

      // Handle variant products
      if (item.variantId && product.variant && product.variant.length > 0) {
        console.log(
          `[DEBUG updateProductQuantity] Processing variant: ${item.variantId}`
        );
        const variantIndex = product.variant.findIndex(
          (v) => v._id.toString() === item.variantId.toString()
        );

        if (variantIndex >= 0) {
          const variant = product.variant[variantIndex];
          console.log(
            `[DEBUG updateProductQuantity] Found variant at index ${variantIndex}, current quantity: ${variant.quantity}`
          );

          // Calculate new quantity, ensuring it doesn't go below 0
          const newQuantity = Math.max(0, variant.quantity - item.quantity);
          product.variant[variantIndex].quantity = newQuantity;
          console.log(
            `[DEBUG updateProductQuantity] Updated variant quantity to ${newQuantity}`
          );

          // Check if all variants are out of stock
          const allVariantsOutOfStock = product.variant.every(
            (v) => v.quantity <= 0
          );
          if (allVariantsOutOfStock) {
            product.status = 'outofstock';
            console.log(
              '[DEBUG updateProductQuantity] All variants out of stock, marking product as outofstock'
            );
          }
        } else {
          console.log(
            `[DEBUG updateProductQuantity] Variant not found: ${item.variantId}`
          );
        }
      } else {
        // Handle non-variant products
        console.log(
          `[DEBUG updateProductQuantity] Processing non-variant product, current quantity: ${product.quantity}`
        );
        // Calculate new quantity, ensuring it doesn't go below 0
        const newQuantity = Math.max(0, product.quantity - item.quantity);
        product.quantity = newQuantity;
        console.log(
          `[DEBUG updateProductQuantity] Updated product quantity to ${newQuantity}`
        );

        // Update product status if out of stock
        if (product.quantity <= 0) {
          product.status = 'outofstock';
          console.log(
            '[DEBUG updateProductQuantity] Product out of stock, marking as outofstock'
          );
        }
      }

      // Increment sold count
      product.sold = (product.sold || 0) + item.quantity;
      console.log(
        `[DEBUG updateProductQuantity] Updated sold count to ${product.sold}`
      );

      // Increment purchase count for recommendations
      product.purchaseCount = (product.purchaseCount || 0) + 1;
      console.log(
        `[DEBUG updateProductQuantity] Updated purchase count to ${product.purchaseCount}`
      );

      await product.save();
      console.log(`[DEBUG updateProductQuantity] Saved product ${product._id}`);
    }
    console.log(
      '[DEBUG updateProductQuantity] Successfully updated all product quantities'
    );
  } catch (error) {
    console.error(
      '[ERROR updateProductQuantity] Error updating product quantity:',
      error.message,
      error.stack
    );
    throw error;
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
