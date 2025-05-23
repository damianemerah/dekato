'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import dbConnect from '@/app/lib/mongoConnection';
import Payment from '@/models/payment';
import { omit } from 'lodash';
import { restrictTo } from '@/app/utils/checkPermission';
import { auth } from '@/app/lib/auth';
import AppError from '@/app/utils/errorClass';
import { handleError } from '@/app/utils/appError';

export async function getPaymentMethod(userId) {
  await restrictTo('user', 'admin');

  // Verify the user is either accessing their own data or is an admin
  const session = await auth();
  if (session?.user?.id !== userId && session?.user?.role !== 'admin') {
    throw new AppError('Unauthorized to access these payment methods', 403);
  }

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
  await restrictTo('user', 'admin');

  try {
    await dbConnect();

    // First, fetch the payment method to verify ownership
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new AppError('Payment method not found', 404);
    }

    // Verify the user is either the owner or an admin
    const session = await auth();
    if (
      session?.user?.id !== payment.userId.toString() &&
      session?.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized to delete this payment method', 403);
    }

    const res = await Payment.findByIdAndDelete(paymentId).lean();

    // Add revalidation
    revalidatePath('/account/payment');
    revalidateTag(`user-${payment.userId}`);
    revalidateTag('payment-data');

    return { id: res._id.toString(), ...omit(res, ['_id', 'userId']) };
  } catch (err) {
    return handleError(err);
  }
}

export async function updatePaymentMethod(paymentId, data) {
  await restrictTo('user', 'admin');

  try {
    await dbConnect();

    // First, fetch the payment method to verify ownership
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new AppError('Payment method not found', 404);
    }

    // Verify the user is either the owner or an admin
    const session = await auth();
    if (
      session?.user?.id !== payment.userId.toString() &&
      session?.user?.role !== 'admin'
    ) {
      throw new AppError('Unauthorized to update this payment method', 403);
    }

    // If setting as default, unset others first
    if (data.isDefault === true || data.isDefault === 'true') {
      await Payment.updateMany(
        { userId: payment.userId, _id: { $ne: paymentId } },
        { isDefault: false }
      );
    }

    const res = await Payment.findByIdAndUpdate(paymentId, data, {
      new: true,
    }).lean();
    return res;
  } catch (err) {
    return handleError(err);
  }
}
