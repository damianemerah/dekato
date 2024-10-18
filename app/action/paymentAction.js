"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongoConnection";
import Payment from "@/models/payment";
import _ from "lodash";

export const getPaymentMethod = async (userId) => {
  await dbConnect();
  const res = await Payment.find({ userId }).lean();
  return res.map((item) => ({
    id: item._id.toString(),
    ..._.omit(item, ["_id", "userId"]),
  }));
};

export const deletePaymentMethod = async (paymentId) => {
  await dbConnect();
  const res = await Payment.findByIdAndDelete(paymentId).lean();
  console.log(res, "res💎💎");
  return { id: res._id.toString(), ..._.omit(res, ["_id", "userId"]) };
};
