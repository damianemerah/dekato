"use server";

import dbConnect from "@/lib/mongoConnection";
import Order from "@/models/order";
import { restrictTo } from "@/utils/checkPermission";
import handleAppError from "@/utils/appError";
import { omit, mapKeys } from "lodash";
import APIFeatures from "@/utils/apiFeatures";
import { revalidatePath } from "next/cache";

export async function getAllOrders(query) {
  console.log(query, "query💎💎");
  await dbConnect();
  await restrictTo("admin");

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

    console.log(order, "order🔥🔥🔥");

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
