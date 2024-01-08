import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new AppError("Please provide your account email", 404);
    }

    const resetToken = await user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetURL = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return handleAppError(error, req);
  }
}
