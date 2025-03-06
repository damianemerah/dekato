'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/app/lib/mongoConnection';
import Payment from '@/models/payment';
import { omit } from 'lodash';

export async function getPaymentMethod(userId) {
  await dbConnect();
  const res = await Payment.find({ userId })
    .select('_id authorization isDefault')
    .lean();
  return res.map((item) => ({
    id: item._id.toString(),
    authorization: omit(item.authorization, ['authorization_code']),
    ...omit(item, ['_id', 'userId', 'authorization']),
  }));
}

export async function deletePaymentMethod(paymentId) {
  await dbConnect();
  const res = await Payment.findByIdAndDelete(paymentId).lean();
  return { id: res._id.toString(), ...omit(res, ['_id', 'userId']) };
}

export async function updatePaymentMethod(paymentId, data) {
  await dbConnect();
  const res = await Payment.findByIdAndUpdate(paymentId, data, {
    new: true,
  }).lean();
  return res;
}
