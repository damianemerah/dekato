"use server";

import dbConnect from "@/lib/mongoConnection";
import User from "@/models/user";
import { Cart } from "@/models/cart";
import { restrictTo } from "@/utils/checkPermission";
import Email from "@/lib/email";
import Address from "@/models/address";
import { filterObj, formDataToObject } from "@/utils/filterObj";
import handleAppError from "@/utils/appError";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";
import _ from "lodash";
import Order from "@/models/order";
import Product from "@/models/product";
import Collection from "@/models/collection"; // Assuming you have a Collection model

export async function getDashboardData() {
  await dbConnect();
  await restrictTo("admin");

  try {
    const [
      salesData,
      customersCount,
      ordersData,
      productsCount,
      collectionsCount,
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$total" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            receiptNumber: 1,
            total: 1,
            status: 1,
            createdAt: 1,
            "user.firstname": 1,
            "user.lastname": 1,
          },
        },
      ]),
      Product.countDocuments(),
      Collection.countDocuments(),
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
    const totalOrders = salesData[0]?.totalOrders || 0;

    return {
      totalSales,
      totalCustomers: customersCount,
      totalOrders,
      recentOrders: ordersData,
      totalProducts: productsCount,
      totalCollections: collectionsCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

export async function createUser(formData) {
  await dbConnect();

  const userData = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  };

  const createdUser = await User.create(userData);

  const user = createdUser.toObject();

  if (user) {
    await Cart.create({ userId: user._id, items: [] });
  }

  const url = `${process.env.NEXTAUTH_URL}/signin`;
  await new Email(user, url).sendWelcome();

  return { success: true };
}

export async function getUser(userId) {
  await dbConnect();
  await restrictTo("admin", "user");

  if (!userId) {
    return null;
  }

  const userData = await User.findById(userId).lean({ virtuals: true });

  if (!userData) {
    throw new Error("No user found with that ID");
  }

  const { _id, wishlist, ...rest } = userData;

  const userObj = {
    id: _id.toString(),
    wishlist: wishlist?.map((item) => item.toString()),
    ...rest,
  };

  return userObj;
}

export async function getWishlist(userId) {
  await dbConnect();
  await restrictTo("admin", "user");

  const { wishlist } = await User.findById(userId)
    .select("wishlist")
    .populate("wishlist", "name price image variant slug")
    .lean();

  return wishlist.map(({ _id, variant, ...rest }) => ({
    id: _id.toString(),
    variant: variant.map(({ _id, ...variantRest }) => ({
      id: _id.toString(),
      ...variantRest,
    })),
    ...rest,
  }));
}

export async function updateUserInfo(formData) {
  await dbConnect();
  await restrictTo("admin", "user");

  const userId = formData.get("userId");

  const userObj = formDataToObject(formData);
  const userData = filterObj(userObj, "firstname", "lastname");

  const user = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  }).lean({ virtuals: true });

  if (!user) {
    throw new Error("User not found");
  }

  const { _id, wishlist, ...rest } = user;

  const userInfo = {
    id: _id.toString(),
    wishlist: wishlist?.map((item) => item.toString()),
    ...rest,
  };

  return userInfo;
}

export async function addToWishlist(userId, productId) {
  await dbConnect();
  await restrictTo("admin", "user");

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.addToWishlist(productId);

  const { _id, wishlist, ...rest } = user.toObject();

  return {
    id: _id.toString(),
    wishlist: wishlist.map((item) => item.toString()),
    ...rest,
  };
}

export async function removeFromWishlist(userId, productId) {
  await dbConnect();
  await restrictTo("admin", "user");

  await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true },
  );

  return null;
}

export async function deleteUser(userId) {
  await dbConnect();
  await restrictTo("admin", "user");

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return null;
}

export async function getUserAddress(userId) {
  await dbConnect();
  // await restrictTo("admin", "user");

  const address = await Address.find({ userId }).lean();

  if (!address.length) {
    throw new Error("No address found for that user");
  }
  return address.map(({ _id, userId, ...rest }) => ({
    id: _id.toString(),
    ..._.omit(rest, ["_id", "userId"]),
  }));
}

export async function createUserAddress(formData) {
  await dbConnect();
  await restrictTo("admin", "user");

  const addressData = formDataToObject(formData);
  const userId = formData.get("userId");

  if (addressData.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  const address = await Address.create({ ...addressData, userId });

  const { _id, userId: id, ...rest } = address.toObject();

  const newAddress = { id: _id.toString(), ...rest };

  // revalidatePath("/checkout");
  // revalidateTag("checkout-data");
  return newAddress;
}

export async function updateUserAddress(formData) {
  await dbConnect();
  await restrictTo("admin", "user");

  const addressData = formDataToObject(formData);
  const userId = formData.get("userId");
  const addressId = formData.get("addressId");

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
  // revalidatePath("/checkout");
  // revalidateTag("checkout-data");

  const { _id, ...rest } = address.toObject();
  return { id: _id.toString(), ...rest };
}

export async function deleteUserAddress(addressId) {
  await restrictTo("admin", "user");
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
    await restrictTo("admin");

    const usersDoc = await User.find().lean({ virtuals: true });

    return usersDoc.map((user) => {
      const { _id, ...rest } = user;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message || "An error occurred");
  }
}

export async function sendPasswordResetToken(formData) {
  await dbConnect();

  const user = await User.findOne({ email: formData.get("email") });

  if (!user) {
    throw new AppError("User with that email not found", 404);
  }
  try {
    const resetToken = await user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetURL = `${process.env.NEXTAUTH_URL}/forgot-password/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    return { success: true, message: "Reset Token sent to your email" };
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function updatePassword(formData) {
  await restrictTo("admin", "user");
  try {
    const body = formDataToObject(formData);

    const user = await User.findById(body.userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    if (!(await user.correctPassword(body.currentPassword, user.password)))
      throw new Error("Incorrect current password");

    user.password = body.password;
    user.passwordConfirm = body.passwordConfirm;
    await user.save();

    return { success: true, data: user };
  } catch (err) {
    const error = handleAppError(err);
    throw new Error(error.message);
  }
}

export async function forgotPassword(formData) {
  try {
    const token = formData.get("token");
    const body = formDataToObject(formData);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await dbConnect();

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() - 10 * 60 * 1000 },
    }).lean({ virtuals: true });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }

    user.password = body.password;
    user.passwordConfirm = body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await User.findByIdAndUpdate(user._id, user, {
      new: true,
      runValidators: true,
    });

    const { _id, wishlist, ...rest } = user;

    const userObj = {
      id: _id.toString(),
      wishlist: wishlist?.map((item) => item.toString()),
      ...rest,
    };

    return { success: true, data: userObj };
  } catch (error) {
    return handleAppError(error, req);
  }
}
