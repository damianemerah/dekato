"use server";

import { Cart, CartItem } from "@/models/cart";
import dbConnect from "@/lib/mongoConnection";
import { restrictTo } from "@/utils/checkPermission";
import AppError from "@/utils/errorClass";

export async function getCheckoutData(userId) {
  try {
    await dbConnect();
    await restrictTo("user", "admin");

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "item",
        populate: {
          path: "productId",
          select: "slug variant image name price discount discountPrice",
        },
      })
      .lean({ virtuals: true });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const checkedItems = cart.item.filter(
      (item) => item.checked && item.productId,
    );

    if (checkedItems.length === 0) {
      throw new AppError("No items selected", 400);
    }

    const formattedItems = checkedItems.map(formatCartItem);
    const amount = calculateTotalAmount(formattedItems);
    const itemCount = checkedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      userId,
      product: formattedItems,
      amount,
      itemCount,
      totalPrice: cart.totalPrice,
    };
  } catch (error) {
    console.error("Error in getCheckoutData:", error);
    throw error;
  }
}

function formatCartItem(cartItem) {
  const { _id, productId, variantId, buffer, cartId, ...rest } = cartItem;
  const variant = productId.variant?.find(
    (v) => v._id.toString() === variantId?.toString(),
  );

  return {
    id: _id.toString(),
    slug: productId.slug,
    productId: productId._id.toString(),
    variantId: variantId?.toString(),
    cartId: cartId.toString(),
    image: variant ? variant.image : productId.image?.[0],
    ...rest,
  };
}
function calculateTotalAmount(items) {
  return items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );
}
