import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import filterObj from "@/utils/filterObj";
import Email from "@/utils/email";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const filterField = filterObj(body, "name", "email", "password");

    const user = await User.create(filterField);

    await new Email(user).sendWelcome();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
    // return NextResponse.redirect(new URL("/signin", req.url));
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  //should be protected route
  try {
    await dbConnect();

    const users = await User.find({});

    return NextResponse.json({
      success: true,
      result: users.length,
      data: users,
    });
  } catch (error) {
    return handleAppError(error, req);
  }
}
