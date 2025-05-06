'use server';

import dbConnect from '@/app/lib/mongoConnection';
import Order from '@/models/order';
import { restrictTo } from '@/app/utils/checkPermission';
import handleAppError from '@/app/utils/appError';
import { omit, mapKeys } from 'lodash';
import APIFeatures from '@/app/utils/apiFeatures';
import { revalidatePath } from 'next/cache';
import Email from '@/app/lib/email';
import { auth } from '@/app/lib/auth';

export async function getAllOrders(query) {
  await dbConnect();
  query.limit = 20;

  try {
    const features = new APIFeatures(Order.find().populate('userId'), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query.lean({ virtuals: true });

    const renamedOrders = orders.map((order) => {
      const renamedOrder = mapKeys(order, (value, key) =>
        key === 'userId' ? 'user' : key
      );
      renamedOrder.id = renamedOrder._id.toString();
      return omit(renamedOrder, '_id');
    });

    const totalCount = await Order.countDocuments();

    return {
      orders: renamedOrders,
      totalCount,
      limit: features.queryString.limit,
      page: features.queryString.page,
    };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getOrderById(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const order = await Order.findById(id)
      .populate('userId')
      .populate('address')
      .lean({ virtuals: true });

    if (!order) {
      return null;
    }

    const renamedOrder = mapKeys(order, (value, key) =>
      key === 'userId' ? 'user' : key
    );
    renamedOrder.id = renamedOrder._id.toString();
    return omit(renamedOrder, '_id');
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function deleteOrder(id) {
  await restrictTo('admin');

  try {
    await dbConnect();
    await Order.findByIdAndDelete(id);
    revalidatePath('/account/orders');
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function checkOrderPayment(userId, paymentRef) {
  try {
    await dbConnect();

    const order = await Order.findOne({ userId, paymentRef }).lean();

    if (!order) {
      return { success: false };
    }

    return {
      success: true,
      // order: {
      //   ...order,
      //   id: order._id.toString(),
      // },
    };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function getUserOrders(userId) {
  await dbConnect();
  const orders = await Order.find({ userId }).limit(3).lean();
  return orders;
}

export async function fulfillOrder(
  id,
  quantities,
  tracking,
  trackingLink,
  carrier,
  shippingMethod
) {
  await restrictTo('admin');

  try {
    await dbConnect();
    const order = await Order.findById(id)
      .populate('userId', 'email firstname lastName')
      .lean();

    if (!order) {
      throw new Error('Order not found');
    }

    // Update each product's fulfilledItems based on the provided quantities
    const updatedProducts = order.product.map((item, index) => {
      return {
        ...item,
        fulfilledItems: quantities[index] || 0, // Set fulfilledItems based on input
      };
    });

    // Update the order with the new products array, tracking, and carrier
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        product: updatedProducts,
        tracking,
        carrier,
        isFulfilled: true,
        deliveryStatus: shippingMethod === 'pickup' ? 'delivered' : 'shipped',
        trackingLink,
      },
      { new: true }
    );

    // Send order email
    const email = new Email(
      order.userId,
      `${process.env.NEXTAUTH_URL}/account/orders/${id}`
    );
    await email.sendEmail(
      'orderFulfill',
      'Your order has been fulfilled',
      updatedOrder
    );

    revalidatePath('/admin/orders');
    return { success: true, message: 'Order fulfilled successfully' };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

/**
 * Gets the status of an order by payment reference
 * @param {string} reference - The payment reference
 * @returns {Promise<Object>} The order status information
 */
export async function getOrderStatus(reference) {
  // Authorization check
  await restrictTo('user', 'admin');

  // Get the authenticated user id
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !reference) {
    return { success: false, message: 'Invalid parameters' };
  }

  try {
    await dbConnect();

    // Find the order with limited field selection for security
    const order = await Order.findOne(
      { paymentRef: reference },
      { status: 1, paymentRef: 1, userId: 1 }
    ).lean();

    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Security check: ensure the user owns this order
    if (order.userId.toString() !== userId) {
      return { success: false, message: 'Unauthorized' };
    }

    return {
      success: true,
      status: order.status,
      reference: order.paymentRef,
    };
  } catch (error) {
    console.error('Error getting order status:', error);
    return {
      success: false,
      message: 'Failed to get order status',
    };
  }
}
