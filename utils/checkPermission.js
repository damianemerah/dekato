import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import AppError from "./errorClass";
import { redirect } from "next/navigation";

//isLoggedin middleware

export const protect = async () => {
  const session = await getServerSession(OPTIONS);
  if (!session) {
    redirect("/signin");
  }

  return session;
};

export const restrictTo = async (...roles) => {
  const session = await protect();
  if (!session?.user || !roles.includes(session.user.role)) {
    return { error: "You do not have permission to perform this action" };
  }
  return session;
};
