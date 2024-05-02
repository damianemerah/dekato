import Order from "@/app/models/order";
import { Product } from "@/app/models/product";
import { Cart, CartItem } from "@/app/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { protect, restrictTo } from "@/utils/checkPermission";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

async function updateProductQuantity(order) {
  for (const item of order.cartItem) {
    const product = await Product.findById(item.product.toString());

    if (item.variantId) {
      const variantIndex = product.variant.findIndex(
        (index) => index._id.toString() === item.variantId
      );
      console.log("variantIndex💎🚀", product.variant[variantIndex]);
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
      { user: userId },
      { $pull: { item: item._id } },
      { new: true }
    );

    await product.save();
  }
}

async function updateProductQuantitySingle(order) {
  const product = await Product.findById(order.singleProduct.productId);

  if (order.singleProduct.variantId) {
    const variantIndex = product.variant.findIndex(
      (index) => index._id.toString() === order.singleProduct.variantId
    );
    console.log("variantIndex💎🚀", product.variant[variantIndex]);
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
  await protect();
  await restrictTo("admin", "user");
  try {
    const body = await req.json();
    console.log("VERIFY ROUTE 💎💎💎");

    const {
      reference,
      metadata: { orderId, userId },
      id: paymentId,
      channel: paymentMethod,
      currency,
    } = body.data;

    const order = await Order.findById(orderId).populate({
      path: "cartItem",
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }
    const verification = await Paystack.transaction.verify(reference);

    if (verification.data.status !== "success") {
      order.status = "payment_failed";
    } else {
      order.status = "payment_confirmed";

      //update product quantity (variants considered)

      if (order.type === "cart") updateProductQuantity(order);
      else if (order.type === "single") updateProductQuantitySingle(order);
    }

    order.paymentRef = reference;
    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod;
    order.currency = currency;

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "ERROR💎💎💎");
    return handleAppError(error, req);
  }
}
