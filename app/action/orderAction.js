"use server";

import dbConnect from "@/lib/mongoConnection";
import Order from "@/models/order";
import { restrictTo } from "@/utils/checkPermission";
import handleAppError from "@/utils/appError";
import { omit, mapKeys } from "lodash";
import APIFeatures from "@/utils/apiFeatures";
import { revalidatePath } from "next/cache";
import Email from "@/lib/email";

export async function getAllOrders(query) {
  await dbConnect();
  query.limit = 20;

  try {
    const features = new APIFeatures(Order.find().populate("userId"), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders = await features.query.lean({ virtuals: true });

    const renamedOrders = orders.map((order) => {
      const renamedOrder = mapKeys(order, (value, key) =>
        key === "userId" ? "user" : key,
      );
      renamedOrder.id = renamedOrder._id.toString();
      return omit(renamedOrder, "_id");
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
  try {
    await dbConnect();
    await restrictTo("admin");

    const order = await Order.findById(id)
      .populate("userId")
      .populate("address")
      .lean({ virtuals: true });

    if (!order) {
      throw new Error("Order not found");
    }

    const renamedOrder = mapKeys(order, (value, key) =>
      key === "userId" ? "user" : key,
    );
    renamedOrder.id = renamedOrder._id.toString();
    return omit(renamedOrder, "_id");
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function deleteOrder(id) {
  await dbConnect();
  await restrictTo("admin");

  await Order.findByIdAndDelete(id);
  revalidatePath("/account/orders");

  revalidatePath("/admin/orders");
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
  shippingMethod,
) {
  await dbConnect();
  await restrictTo("admin");

  console.log(quantities, "r📁📁");

  try {
    const order = await Order.findById(id)
      .populate("userId", "email firstname lastName")
      .lean();

    if (!order) {
      throw new Error("Order not found");
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
        deliveryStatus: shippingMethod === "pickup" ? "delivered" : "shipped",
        trackingLink,
      },
      { new: true },
    );

    // Send order email
    const email = new Email(
      order.userId,
      `${process.env.NEXTAUTH_URL}/account/orders/${id}`,
    );
    await email.sendEmail(
      "orderFulfill",
      "Your order has been fulfilled",
      updatedOrder,
    );

    revalidatePath("/admin/orders");
    return { success: true, message: "Order fulfilled successfully" };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}
