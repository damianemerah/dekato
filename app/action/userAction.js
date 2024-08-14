"use server";

import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { Cart } from "@/models/cart";
import Wishlist from "@/models/wishlist";
import { restrictTo } from "@/utils/checkPermission";
import Email from "@/lib/email";
import Address from "@/models/address";
import { filterObj } from "@/utils/filterObj";

export async function createUser(formData) {
  await dbConnect();

  const userData = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  const user = await User.create(userData);

  if (user) {
    await Cart.create({ userId: user._id, item: [] });
    await Wishlist.create({ userId: user._id, product: [] });
  }

  const url = process.env.NEXTAUTH_URL + "/signin";
  await new Email(user, url).sendWelcome();

  return user;
}

export async function getUser(userId) {
  await dbConnect();
  restrictTo("admin");

  const userData = await User.findById(userId);

  if (!userData) {
    throw new Error("No user found with that ID");
  }

  const user = userData.toObject();

  // Rename _id to id and convert to string
  const { _id, ...rest } = user;
  return { id: _id.toString(), ...rest };
}

export async function updateUserInfo(userId, formData) {
  await dbConnect();
  restrictTo("admin, user");

  const userObj = formDataToObject(formData);
  const userData = filterObj(userObj, "firstname", "lastname");

  const user = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function deleteUser(userId) {
  await dbConnect();
  restrictTo("admin, user");

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return null;
}

export async function getUserAddress(userId) {
  await dbConnect();
  restrictTo("admin, user");

  const address = await Address.find({ userId });

  if (!address) {
    throw new Error("No address found for that user");
  }
  return address;
}

export async function createUserAddress(userId, formData) {
  await dbConnect();
  restrictTo("admin, user");

  const addressData = formDataToObject(formData);

  if (addressData.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = await Address.create({ ...addressData, userId });

  return address;
}

export async function updateUserAddress(userId, addressId, formData) {
  await dbConnect();
  restrictTo("admin, user");

  const addressData = formDataToObject(formData);

  if (addressData.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = await Address.findByIdAndUpdate(addressId, addressData, {
    new: true,
    runValidators: true,
  });

  if (!address) {
    throw new Error("No address found with that ID");
  }

  return address;
}

export async function deleteUserAddress(addressId) {
  restrictTo("admin, user");
  await dbConnect();

  const address = await Address.findByIdAndDelete(addressId);

  if (!address) {
    throw new Error("Address not found");
  }

  return null;
}
