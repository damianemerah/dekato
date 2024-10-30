"use server";

import { Cart, CartItem } from "@/models/cart";
import dbConnect from "@/lib/mongoConnection";
import { restrictTo } from "@/utils/checkPermission";
import AppError from "@/utils/errorClass";
import _ from "lodash";

export async function getCheckoutData(userId) {
  try {
    await dbConnect();
    await restrictTo("user", "admin");

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "item",
        populate: {
          path: "product",
          select: "slug variant image name price discount discountPrice",
        },
      })
      .lean({ virtuals: true });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const checkedItems = cart.item.filter((item) => item.checked);

    const formattedItems = checkedItems.map(formatCartItem);

    const itemCount = checkedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      userId,
      items: formattedItems,
      itemCount,
      totalPrice: cart.totalPrice,
    };
  } catch (error) {
    console.error("Error in getCheckoutData:", error);
    throw error;
  }
}

function formatCartItem(cartItem) {
  const { _id, product, variantId, cartId, ...rest } = cartItem;
  const variant = product.variant?.find(
    (v) => v._id.toString() === variantId?.toString(),
  );

  const price = variant ? variant.price : product.price;
  const discountPrice = product.isDiscounted
    ? variant
      ? variant.discountPrice
      : product.discountPrice
    : null;

  console.log(discountPrice, "discountPrice⭐⭐");

  return {
    id: _id.toString(),
    option: cartItem.option,
    price,
    discountPrice,
    product: {
      id: product._id.toString(),
      ..._.omit(product, ["_id"]),
    },
    variantId: variantId?.toString(),
    cartId: cartId.toString(),
    image: variant ? variant.image : product.image?.[0],
    ...rest,
  };
}
