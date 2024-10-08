import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import crypto from "crypto";

export async function GET(req, { params }) {
  try {
    const token = params.token;
    const body = await req.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("hashedToken🚀🚀", hashedToken);

    await dbConnect();

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    user.password = body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
