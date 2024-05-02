import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import AppError from "./errorClass";

//isLoggedin middleware

export const protect = async () => {
  const session = await getServerSession(options);
  if (!session) {
    const url = new URL("/signin", "http://localhost:3000");
    return NextResponse.redirect(url.href);
  }
};

//isProtected middleware
export const restrictTo = async (...roles) => {
  const session = await getServerSession(options);
  console.log(session, session.user.role, "session.user.role");
  if (!roles.includes(session?.user?.role)) {
    throw new AppError(
      "You do not have permission to perform this action",
      403
    );
  }
};
