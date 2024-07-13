import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import filterObj from "@/utils/filterObj";
import { Cart } from "@/models/cart";
import Wishlist from "@/models/wishlist";
import { protect, restrictTo } from "@/utils/checkPermission";
import Email from "@/utils/email";

export async function POST(req) {
  console.log("Create User🔥🔥🔥", req.nextUrl.origin);
  try {
    await dbConnect();

    const body = await req.json();
    const filterField = filterObj(
      body,
      "firstname",
      "lastname",
      "email",
      "password",
      "passwordConfirm"
    );

    const url = `${req.nextUrl.origin}/signin`;

    const user = await User.create(filterField);

    if (user) {
      console.log("🎈🎈", user);
      await Cart.create({ userId: user._id, item: [] });
      await Wishlist.create({ userId: user._id, product: [] });
    }

    //send welcome email
    await new Email(user, url).sendWelcome();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log(error, "AppError🔥🔥🔥");
    return handleAppError(error, req);
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const userId = params.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("No user found with that ID", 404);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  await protect();
  try {
    await dbConnect();

    const body = await req.json();
    const filterField = filterObj(body, "firstname", "lastname");

    const user = await User.findByIdAndUpdate(body.id, filterField, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  await protect();
  await restrictTo("admin");
  try {
    await dbConnect();
    const { id } = await req.json();
    const user = await User.findByIdAndUpdate(id, { active: false });

    console.log("🎈🎈", user);

    if (!user) throw new AppError("No user found with that ID", 404);

    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
