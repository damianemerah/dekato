"use server";

import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { Cart } from "@/models/cart";
import Wishlist from "@/models/wishlist";
import { restrictTo } from "@/utils/checkPermission";
import Email from "@/lib/email";
import Address from "@/models/address";
import { filterObj } from "@/utils/filterObj";
import handleAppError from "@/utils/appError";
import Order from "@/models/order";

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

  if (!userId) {
    return;
  }

  const userData = await User.findById(userId).populate("address");

  if (!userData) {
    throw new Error("No user found with that ID");
  }

  const userObj = userData.toObject();

  const { _id, address, ...rest } = userObj;
  const addressArr = address.map((addr) => {
    const { _id, userId, ...rest } = addr;
    return { id: _id.toString(), ...rest };
  });

  // Rename _id to id and convert to string
  return { id: _id.toString(), address: addressArr, ...rest };
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

export async function getAllUsers() {
  try {
    await dbConnect();
    restrictTo("admin");

    const usersDoc = await User.find()
      .populate("address", "address city state country isDefault")
      .populate("orderCount");
    // .populate("amountSpent");

    const users = usersDoc.map((user) => {
      const userObj = user.toObject();
      const { _id, address, ...rest } = userObj;
      const addressArr = address.map((addr) => {
        const { _id, userId, ...rest } = addr;
        return { id: _id.toString(), ...rest };
      });
      return { id: _id.toString(), address: addressArr, ...rest };
    });

    return users;
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}
