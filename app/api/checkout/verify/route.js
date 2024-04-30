import Order from "@/app/models/order";
import { Product } from "@/app/models/product";
import { Cart, CartItem } from "@/app/models/cart";
import { NextResponse } from "next/server";
import AppError from "@/utils/errorClass";
import handleAppError from "@/utils/appError";
import { isArray } from "lodash";
import { EventEmitter } from "events";
import order from "@/app/models/order";
const Paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const eventEmitter = new EventEmitter();

async function orderComplete(orderData) {
  eventEmitter.emit("orderComplete", orderData);
  await clearCart(orderData);
}

// Function to clear cart input
async function clearCart(orderData) {
  const { user } = orderData;

  //clear cart with cart.item.id === order.item.id

  await Cart.updateOne(
    { user: user },
    { $pull: { item: { $in: orderData.item } } },
    { new: true }
  )
    .then((data) => {
      console.log("Cart cleared!", data);
    })
    .catch((error) => {
      console.log("Cart clear failed", error);
    });

  //delete cartItem
  const cartItem = await CartItem.deleteMany({ _id: { $in: orderData.item } });
  console.log("Cart cleared!", cartItem);
}

export async function POST(req) {
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
      path: "item",
    });
    const cart = await Cart.findOne({ user: userId });

    console.log(cart, "Cart🚀");

    if (!order) {
      throw new AppError("Order not found", 404);
    }
    const verification = await Paystack.transaction.verify(reference);

    if (verification.data.status !== "success") {
      order.status = "payment_failed";
    } else {
      console.log("payment successful💎💎");
      order.status = "payment_confirmed";

      //update product quantity (variants considered)

      for (const item of order.item) {
        const product = await Product.findById(item.product.toString());
        if (item.variantId) {
          const variantIndex = product.variant.findIndex(
            (index) => index._id.toString() === item.variantId
          );
          product.variant[variantIndex].quantity -= item.quantity;
          product.quantity -= item.quantity;
          product.sold += item.quantity;
        } else {
          product.quantity -= item.quantity;
          product.sold += item.quantity;
        }
        await product.save();
      }
    }

    order.paymentRef = reference;
    order.paymentId = paymentId;
    order.paymentMethod = paymentMethod;
    order.currency = currency;

    await order.save();

    await orderComplete(order);
    //clear cart
    // const updatedCart = await Cart.updateOne(
    //   { user: userId },
    //   { $pull: { item: { checked: true } } },
    //   { new: true }
    // );

    // if (!updatedCart) {
    //   throw new AppError("Cart update failed (might already be empty)", 500);
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified",
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAppError(error, req);
  }
}
