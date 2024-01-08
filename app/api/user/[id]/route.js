import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import filterObj from "@/utils/filterObj";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    // console.log("🎈🎈", searchParams);

    const id = params.id;

    const user = await User.findById(id);

    if (!user) {
      throw new AppError("No user found with that ID", 404);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const id = params.id;
    const body = await req.json();
    const filterField = filterObj(body, "name", "email", "contact");

    const user = await User.findByIdAndUpdate(id, filterField, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const user = await User.findByIdAndDelete(id);

    await dbConnect();

    if (!user) throw new AppError("No user found with that ID", 404);

    return NextResponse.json({ success: true, data: null }, { status: 204 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
