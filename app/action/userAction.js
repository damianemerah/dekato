'use server';

import dbConnect from '@/app/lib/mongoConnection';
import User from '@/models/user';
import { Cart } from '@/models/cart';
import { restrictTo } from '@/app/utils/checkPermission';
import Email from '@/app/utils/email';
import Address from '@/models/address';
import { filterObj, formDataToObject } from '@/app/utils/filterObj';
import { handleError } from '@/app/utils/appError';
import AppError from '@/app/utils/errorClass';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';
import { omit } from 'lodash';
import Order from '@/models/order';
import Product from '@/models/product';
import Collection from '@/models/collection';
import Notification from '@/models/notification';
import { EmailSubscription } from '@/models/subscription';

export async function createProductNotification(productName, adminName) {
  await dbConnect();
  try {
    await Notification.create({
      userId: null, // Admin notification
      title: 'New Product Added',
      message: `Admin ${adminName} added new product "${productName}" to inventory`,
      type: 'info',
    });
  } catch (error) {
    console.error('Error creating product notification:', error);
    return handleError(error);
  }
}

export async function getDashboardData() {
  await dbConnect();

  try {
    const [
      salesData,
      customersCount,
      ordersData,
      productsData,
      collectionsData,
      notificationsData,
      subscriptionData,
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ['$deliveryStatus', 'pending'] }, 1, 0] },
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ['$deliveryStatus', 'shipped'] }, 1, 0] },
            },
            deliveredOrders: {
              $sum: {
                $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0],
              },
            },
          },
        },
      ]),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 1,
            paymentRef: 1,
            total: 1,
            deliveryStatus: 1,
            createdAt: 1,
            'user.firstname': 1,
            'user.lastname': 1,
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
            },
            outOfStock: {
              $sum: { $cond: [{ $eq: ['$status', 'outofstock'] }, 1, 0] },
            },
            discountedProducts: {
              $sum: { $cond: [{ $gt: ['$discount', 0] }, 1, 0] },
            },
          },
        },
      ]),
      Collection.aggregate([
        {
          $group: {
            _id: null,
            totalCollections: { $sum: 1 },
            saleCollections: {
              $sum: { $cond: [{ $eq: ['$isSale', true] }, 1, 0] },
            },
          },
        },
      ]),
      Notification.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $project: {
            title: 1,
            message: 1,
            type: 1,
            status: 1,
            createdAt: 1,
          },
        },
      ]),
      EmailSubscription.aggregate([
        {
          $group: {
            _id: null,
            totalSubscribers: { $sum: 1 },
            activeSubscribers: {
              $sum: { $cond: [{ $eq: ['$status', 'subscribed'] }, 1, 0] },
            },
            menPreference: {
              $sum: { $cond: [{ $eq: ['$gender', 'men'] }, 1, 0] },
            },
            womenPreference: {
              $sum: { $cond: [{ $eq: ['$gender', 'women'] }, 1, 0] },
            },
            bothPreference: {
              $sum: { $cond: [{ $eq: ['$gender', 'both'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
    const totalOrders = salesData[0]?.totalOrders || 0;
    const orderStatus = {
      pending: salesData[0]?.pendingOrders || 0,
      shipped: salesData[0]?.shippedOrders || 0,
      delivered: salesData[0]?.deliveredOrders || 0,
    };

    const products = {
      total: productsData[0]?.totalProducts || 0,
      active: productsData[0]?.activeProducts || 0,
      outOfStock: productsData[0]?.outOfStock || 0,
      discounted: productsData[0]?.discountedProducts || 0,
    };

    const collections = {
      total: collectionsData[0]?.totalCollections || 0,
      onSale: collectionsData[0]?.saleCollections || 0,
    };

    const newsletter = {
      total: subscriptionData[0]?.totalSubscribers || 0,
      active: subscriptionData[0]?.activeSubscribers || 0,
      preferences: {
        men: subscriptionData[0]?.menPreference || 0,
        women: subscriptionData[0]?.womenPreference || 0,
        both: subscriptionData[0]?.bothPreference || 0,
      },
    };

    return {
      totalSales,
      totalCustomers: customersCount,
      totalOrders,
      orderStatus,
      recentOrders: ordersData,
      products,
      collections,
      recentNotifications: notificationsData,
      newsletter,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function createUser(prevState, formData) {
  try {
    await dbConnect();

    const userData = {
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirm: formData.get('passwordConfirm'),
    };

    const createdUser = await User.create(userData);

    const user = createdUser.toObject();

    if (user) {
      await Cart.create({ userId: user._id, items: [] });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    await User.findByIdAndUpdate(user._id, {
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000, //10 minutes
    });

    const url = `${process.env.NEXTAUTH_URL}/signin?token=${rawToken}`;
    await new Email(user, url).sendWelcome();

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return handleError(error);
  }
}

//verify email
export async function verifyEmail(token) {
  await dbConnect();
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    return { success: false, message: 'Invalid token' };
  }

  if (user.verificationTokenExpires < Date.now()) {
    return { success: false, message: 'Token expired' };
  }

  user.active = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });

  return { success: true, message: 'Email verified successfully' };
}

export async function getUser(userId) {
  await restrictTo('admin', 'user');

  await dbConnect();

  if (!userId) {
    return null;
  }

  const userData = await User.findById(userId)
    .where('active', true)
    .lean({ virtuals: true });

  if (!userData) {
    throw new AppError('No active user found with that ID', 404);
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
  await restrictTo('admin', 'user');

  await dbConnect();

  const { wishlist } = await User.findById(userId)
    .select('wishlist')
    .populate('wishlist', 'name price image variant slug')
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
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const userId = formData.get('userId');

    const userObj = formDataToObject(formData);
    const userData = filterObj(userObj, 'firstname', 'lastname');

    const user = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    }).lean({ virtuals: true });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { _id, wishlist, ...rest } = user;

    const userInfo = {
      id: _id.toString(),
      wishlist: wishlist?.map((item) => item.toString()),
      ...rest,
    };

    // Add revalidation for paths and tags
    revalidatePath('/account/settings');
    revalidatePath('/account');
    revalidateTag(`user-${userId}`);

    return userInfo;
  } catch (err) {
    return handleError(err);
  }
}

export async function addToWishlist(userId, productId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.addToWishlist(productId);

    const { _id, wishlist, ...rest } = user.toObject();

    // Add proper revalidation
    revalidatePath('/account/wishlist');
    revalidatePath('/account');
    revalidateTag(`user-${userId}`);

    return {
      id: _id.toString(),
      wishlist: wishlist.map((item) => item.toString()),
      ...rest,
    };
  } catch (err) {
    return handleError(err);
  }
}

export async function removeFromWishlist(userId, productId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    // Add proper revalidation
    revalidatePath('/account/wishlist');
    revalidatePath('/account');
    revalidateTag(`user-${userId}`);

    return null;
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteUser(userId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const user = await User.findByIdAndUpdate(userId, { active: false });

    if (!user) {
      throw new AppError('User not found', 404);
    }
    revalidatePath('/admin/customers');
    return null;
  } catch (err) {
    return handleError(err);
  }
}

export async function getUserAddress(userId) {
  await restrictTo('admin', 'user');

  await dbConnect();

  const address = await Address.find({ userId }).lean();

  if (!address.length) {
    return [];
  }
  return address.map(({ _id, userId, ...rest }) => ({
    id: _id.toString(),
    ...omit(rest, ['_id', 'userId']),
  }));
}

export async function createUserAddress(formData) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const addressData = formDataToObject(formData);
    const userId = formData.get('userId');

    if (addressData.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({ ...addressData, userId });

    const { _id, userId: id, ...rest } = address.toObject();

    const newAddress = { id: _id.toString(), ...rest };

    // Add proper revalidation
    revalidatePath('/account/address');
    revalidatePath('/checkout');
    revalidateTag(`user-${userId}`);
    revalidateTag('checkout-data');

    return newAddress;
  } catch (err) {
    return handleError(err);
  }
}

export async function updateUserAddress(formData) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const addressData = formDataToObject(formData);
    const userId = formData.get('userId');
    const addressId = formData.get('addressId');

    if (addressData.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.findByIdAndUpdate(addressId, addressData, {
      new: true,
      runValidators: true,
    });

    if (!address) {
      throw new AppError('No address found with that ID', 404);
    }

    // Add proper revalidation
    revalidatePath('/account/address');
    revalidatePath('/checkout');
    revalidateTag(`user-${userId}`);
    revalidateTag('checkout-data');

    const { _id, ...rest } = address.toObject();
    return { id: _id.toString(), ...rest };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteUserAddress(addressId) {
  await restrictTo('admin', 'user');

  try {
    await dbConnect();

    const address = await Address.findByIdAndDelete(addressId);
    if (!address) {
      throw new AppError('No address found with that ID', 404);
    }

    // Add proper revalidation
    revalidatePath('/account/address');
    revalidatePath('/checkout');
    revalidateTag(`user-${address.userId}`);
    revalidateTag('checkout-data');

    return null;
  } catch (err) {
    return handleError(err);
  }
}

export async function getAllUsers(searchParams) {
  await dbConnect();

  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 20;
  const skip = (page - 1) * limit;

  const totalCount = await User.countDocuments();

  const usersDoc = await User.find()
    .skip(skip)
    .limit(limit)
    .select('+active')
    .lean({ virtuals: true });

  const users = usersDoc.map((user) => {
    const { _id, ...rest } = user;
    return {
      id: _id.toString(),
      ...rest,
    };
  });

  return {
    data: users,
    pagination: {
      totalCount,
      currentPage: page,
      limit,
    },
  };
}

export async function sendPasswordResetToken(prevState, formData) {
  await dbConnect();
  const user = await User.findOne({ email: formData.get('email') });
  try {
    if (!user) {
      return {
        success: false,
        message: 'User with that email not found',
        errors: { email: ['No account found with this email address'] },
      };
    }

    const resetToken = await user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetURL = `${process.env.NEXTAUTH_URL}/forgot-password/${resetToken}`;

    console.log(resetURL, 'resetURL');

    await new Email(user, resetURL).sendPasswordReset();

    return { success: true, message: 'Reset Token sent to your email' };
  } catch (err) {
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return handleError(err);
  }
}

export async function updatePassword(formData) {
  await restrictTo('admin', 'user');
  try {
    const body = formDataToObject(formData);

    const user = await User.findById(body.userId).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!(await user.correctPassword(body.currentPassword, user.password)))
      throw new AppError('Incorrect current password', 404);

    user.password = body.password;
    user.passwordConfirm = body.passwordConfirm;
    await user.save();

    // Add revalidation
    revalidatePath('/account/settings');
    revalidatePath('/account');
    revalidateTag(`user-${body.userId}`);
    revalidatePath('/', 'layout');

    return { success: true, data: user.toObject() };
  } catch (err) {
    return handleError(err);
  }
}

export async function forgotPassword(token, prevState, formData) {
  try {
    const body = formDataToObject(formData);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    await dbConnect();

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() - 10 * 60 * 1000 },
    });

    if (!user) {
      return {
        success: false,
        message: 'Token is invalid or has expired',
        errors: null,
      };
    }

    // check if password and passwordConfirm are the same
    user.password = body.password;
    user.passwordConfirm = body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const { _id, wishlist, ...rest } = user.toObject();

    const userObj = {
      id: _id.toString(),
      wishlist: wishlist?.map((item) => item.toString()),
      ...rest,
    };

    return {
      success: true,
      message: 'Password reset successful',
      data: userObj,
    };
  } catch (error) {
    return handleError(error);
  }
}
