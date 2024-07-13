import dbConnect from "@/lib/mongoConnection";
import Address from "@/models/address";
import User from "@/models/user";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    console.log("userId", userId);

    const user = await User.findById(userId);
    if (!user) throw new AppError("No user found with that ID", 404);

    const userAddress = await Address.find({ userId });

    if (!userAddress) throw new AppError("No address found for this user", 404);

    return NextResponse.json(
      { success: true, data: userAddress },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const user = await User.findById(body.userId);
    if (!user) throw new AppError("No user found with that ID", 404);

    if (body.isDefault) {
      await Address.updateMany({ user: body.userId }, { isDefault: false });
    }

    const address = await Address.create({ ...body, user: body.userId });

    //add address to user
    user.address.push(address._id);
    await user.save({ validateBeforeSave: false });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, addressId, isDefault } = body;

    const user = await User.findById(userId);
    if (!user) throw new AppError("No user found with that ID", 404);

    // update default address and set all other addresses to false
    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = await Address.findByIdAndUpdate(addressId, body, {
      new: true,
      runValidators: true,
    });

    if (!address) {
      throw new AppError("No address found with that ID", 404);
    }

    return NextResponse.json({ success: true, data: address }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const { addressId } = await req.json();

    const address = await Address.findByIdAndDelete(addressId);
    if (!address) {
      throw new AppError("No address found with that ID", 404);
    }
    return NextResponse.json({ success: true, data: null }, { status: 200 });
  } catch (error) {
    return handleAppError(error, req);
  }
}
