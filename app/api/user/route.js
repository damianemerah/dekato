import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import filterObj from "@/utils/filterObj";
import Email from "@/utils/email";
import options from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const filterField = filterObj(
      body,
      "firstname",
      "lastname",
      "email",
      "password"
    );

    const url = `${req.nextUrl.origin}/signin`;

    console.log(url, "🚀🚀");
    const user = await User.create(filterField);

    //send welcome email
    await new Email(user, url).sendWelcome();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function GET(req) {
  //should be protected route

  const { user } = await getServerSession(options);

  console.log(user, "🔥f🔥");

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
