import dbConnect from "@/utils/mongoConnection";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import handleAppError from "@/utils/appError";
import AppError from "@/utils/errorClass";
import filterObj from "@/utils/filterObj";
import { Cart } from "@/app/models/cart";
import Wishlist from "@/app/models/wishlist";

export async function POST(req) {
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
      await Cart.create({ user: user._id, item: [] });
      await Wishlist.create({ user: user._id, product: [] });
    }

    //send welcome email
    // await new Email(user, url).sendWelcome();

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.log(error, "AppError🔥🔥🔥");
    return handleAppError(error, req);
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    // console.log("🎈🎈", searchParams);

    const userId = params.userId;

    const user = await User.findById(userId).populate("address");

    if (!user) {
      throw new AppError("No user found with that ID", 404);
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
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
