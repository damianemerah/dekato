"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoConnection";
import Payment from "@/models/payment";
import _ from "lodash";

export async function getPaymentMethod(userId) {
  await dbConnect();
  const res = await Payment.find({ userId })
    .select("_id authorization isDefault")
    .lean();
  return res.map((item) => ({
    id: item._id.toString(),
    authorization: _.omit(item.authorization, ["authorization_code"]),
    ..._.omit(item, ["_id", "userId", "authorization"]),
  }));
}

export async function deletePaymentMethod(paymentId) {
  await dbConnect();
  const res = await Payment.findByIdAndDelete(paymentId).lean();
  console.log(res, "res💎💎");
  return { id: res._id.toString(), ..._.omit(res, ["_id", "userId"]) };
}

export async function updatePaymentMethod(paymentId, data) {
  await dbConnect();
  const res = await Payment.findByIdAndUpdate(paymentId, data, {
    new: true,
  }).lean();
  return res;
}
