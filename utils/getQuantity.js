import AppError from "./errorClass";

export default function getQuantity(item, product) {
  // Check if product exists or variant exists
  if (item.variantId && product?.variant.length > 0) {
    const variant = product.variant.find(
      (doc) => doc._id.toString() === item.variantId,
    );

    if (!variant || variant.quantity === 0) {
      throw new Error("Product out of stock");
    }

    if (item.quantity > variant.quantity && variant.quantity > 0) {
      item.quantity = variant.quantity;
      return item.quantity;
    } else {
      return item.quantity;
    }
  } else if (product.quantity === 0) {
    throw new Error("Product out of stock");
  } else if (item.quantity > product.quantity && product.quantity > 0) {
    item.quantity = product.quantity;
    return item.quantity;
  } else {
    return item.quantity;
  }
}
