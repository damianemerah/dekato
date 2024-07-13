import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import AppError from "./errorClass";
import { redirect } from "next/navigation";

//isLoggedin middleware

export const protect = async () => {
  const session = await getServerSession(OPTIONS);
  if (!session) {
    console.log("No session found");
    redirect("/signin");
  }

  return session;
};

export const restrictTo = async (...roles) => {
  const session = await protect();
  console.log(session, "session🚀🚀🚀");

  if (!session) {
    throw new AppError("Please log in to access this resource", 401);
  }
  if (!roles.includes(session?.user.role)) {
    throw new AppError(
      "You do not have permission to perform this action",
      403,
    );
  }
  return session;
};
