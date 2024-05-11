import User from "@/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import { protect, restrictTo } from "@/utils/checkPermission";

export async function PATCH(req) {
  await protect();
  await restrictTo("admin", "user");
  try {
    const body = await req.json();

    const user = await User.findById(body.id).select("+password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    console.log(user, "🔗🚀🚀🔗");
    console.log(user.schema.methods);

    if (!(await user.correctPassword(body.currentPassword, user.password)))
      throw new AppError("Incorrect current password", 401);

    user.password = body.password;
    await user.save();

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
