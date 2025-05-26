// External dependencies
import { NextResponse } from 'next/server';
import { startSession } from 'mongoose';
import { customAlphabet } from 'nanoid';

// Database models
import Order from '@/models/order';
import Address from '@/models/address';
import Payment from '@/models/payment';
import { Cart, CartItem } from '@/models/cart';
import dbConnect from '@/app/lib/mongoConnection';

// Utils
import AppError from '@/app/utils/errorClass';
import handleAppError from '@/app/utils/appError';
import { restrictTo } from '@/app/utils/checkPermission';

// Initialize nanoid and payment gateway
const nanoId = customAlphabet('0123456789', 6);
const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

export async function GET(req, { params }) {
  await restrictTo('admin', 'user');
  try {
    const { userId } = params;

    await dbConnect();

    const cartItems = await Cart.findOne({ userId: userId[0] });

    const items = cartItems.item.filter((item) => {
      return item.checked === true;
    });

    if (items.length === 0) {
      throw new AppError('No items selected', 400);
    }

    const amount = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const checkoutData = {
      userId: userId.toString(),
      product: items,
      total: amount,
    };

    return NextResponse.json(
      { success: true, data: checkoutData },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}

export async function POST(req, { params }) {
  await restrictTo('admin', 'user');
  await dbConnect();
  const session = await startSession();
  try {
    session.startTransaction();

    const {
      userId: [userId],
    } = params;
    const body = await req.json();
    const { shippingMethod, address, items, amount, email, saveCard, cardId } =
      body;

    if (shippingMethod?.toLowerCase() === 'delivery' && !address) {
      throw new AppError('Address is required for delivery', 400);
    }

    if (shippingMethod?.toLowerCase() === 'delivery') {
      const userAddress = await Address.findOne({
        userId,
        _id: address.id,
        isDefault: true,
      }).session(session);

      if (!userAddress) {
        throw new AppError('User address not found', 404);
      }
    }
    const payId = nanoId();
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const orderData = {
      userId: userId,
      product: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.currentPrice,
        image: item.image,
        quantity: item.quantity,
        option: item.option,
        variantId: item.variantId,
      })),
      paymentRef: payId,
      cartItems: items.map((item) => item.id),
      total: amount,
      totalItems,
      shippingMethod: shippingMethod?.toLowerCase(),
      address:
        shippingMethod?.toLowerCase() === 'delivery' ? address.id : undefined,
    };

    //session require array of objects
    const order = await Order.create([orderData], { session });

    const createdOrder = order[0];

    if (!order) {
      throw new AppError('Order could not be created', 500);
    }

    let paymentInitializeOptions = {
      email: email,
      amount: Math.round(amount * 100),
      callback_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
      currency: 'NGN',
      reference: payId,
      metadata: {
        orderId: createdOrder['_id'].toString(),
        userId,
        saveCard: saveCard,
      },
    };

    if (cardId) {
      const paymentMethod = await Payment.findOne({
        _id: cardId,
        userId,
      });
      if (!paymentMethod) {
        throw new AppError('Payment method not found', 404);
      }
      paymentInitializeOptions.authorization_code =
        paymentMethod.authorization.authorization_code;

      paymentInitializeOptions.email = paymentMethod.email || email;
    }

    const payment = await Paystack.transaction.initialize(
      paymentInitializeOptions
    );

    if (!payment || payment.status === false) {
      throw new AppError(payment.message, 500);
    }

    await session.commitTransaction();

    return NextResponse.json(
      { success: true, data: { payment, order: createdOrder } },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  } finally {
    session.endSession();
  }
}
