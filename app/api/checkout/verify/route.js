import Order from "@/models/order";
import Product from "@/models/product";
import { Cart, CartItem } from "@/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { protect, restrictTo } from "@/utils/checkPermission";
import { revalidatePath } from "next/cache";
import Payment from "@/models/payment";

const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

async function updateProductQuantity(order) {
  for (const item of order.product) {
    const product = await Product.findById(item.productId.toString());

    if (item.variantId) {
      const variantIndex = product.variant.findIndex(
        (index) => index._id.toString() === item.variantId,
      );
      product.variant[variantIndex].quantity -= item.quantity;
      product.quantity -= item.quantity;
      product.sold += item.quantity;
    } else {
      product.quantity -= item.quantity;
      product.sold += item.quantity;
    }

    //delete cartItem
    await CartItem.deleteOne({ _id: item._id });

    await Cart.updateOne(
      { userId: order.userId },
      { $pull: { item: item._id } },
      { new: true },
    );

    await product.save();
  }
}

async function updateProductQuantitySingle(order) {
  const product = await Product.findById(order.singleProduct.product);

  if (order.singleProduct.variantId) {
    const variantIndex = product.variant.findIndex(
      (index) => index._id.toString() === order.singleProduct.variantId,
    );
    product.variant[variantIndex].quantity -= order.singleProduct.quantity;
    product.quantity -= order.singleProduct.quantity;
    product.sold += order.singleProduct.quantity;
  } else {
    product.quantity -= order.singleProduct.quantity;
    product.sold += order.singleProduct.quantity;
  }

  await product.save();
}

export async function POST(req) {
  // await restrictTo("admin", "user");
  try {
    const body = await req.json();

    const {
      reference,
      metadata: { orderId, userId, receipt_number, saveCard },
      id: paymentId,
      channel: paymentMethod,
      currency,
    } = body.data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Something went wrong", 404);
    }
    const verification = await Paystack.transaction.verify(reference);

    //update product quantity (variants considered)
    if (verification.data.status === "success") {
      if (order.type === "cart") await updateProductQuantity(order);
      else if (order.type === "single")
        await updateProductQuantitySingle(order);
    }

    order.status = verification?.data?.status;
    order.paymentRef = reference;
    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod;
    order.currency = currency;
    order.receiptNumber = receipt_number;
    order.paidAt = verification?.data?.paidAt;

    await order.save();

    console.log(saveCard, "saveCard💎💎");

    if (saveCard && verification?.data?.authorization?.reusable) {
      const cardData = {
        userId,
        email: verification?.data?.customer?.email,
        cardType: verification?.data?.authorization?.card_type,
        last4: verification?.data?.authorization?.last4,
        expiryMonth: verification?.data?.authorization?.exp_month,
        expiryYear: verification?.data?.authorization?.exp_year,
        authorizationCode:
          verification?.data?.authorization?.authorization_code,
      };

      const payment = await Payment.create(cardData);
      console.log(payment, "payment💎💎");
    }

    revalidatePath("/account/orders");

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified",
        data: order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error, "payment_error💎💎");
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
