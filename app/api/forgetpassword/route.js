import dbConnect from '@/app/lib/mongoConnection';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import handleAppError from '@/utils/appError';
import AppError from '@/utils/errorClass';
import Email from '@/app/lib/email';

export async function POST(req) {
  const body = await req.json();
  await dbConnect();

  const user = await User.findOne({ email: body.email });

  if (!user) {
    throw new AppError('User with that email not found', 404);
  }
  try {
    const resetToken = await user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetURL = `${process.env.NEXTAUTH_URL}/api/resetpassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    return NextResponse.json(
      { success: true, message: 'Reset Token sent to your email' },
      { status: 200 }
    );
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return handleAppError(error, req);
  }
}
