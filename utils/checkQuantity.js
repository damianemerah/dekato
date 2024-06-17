import AppError from "./errorClass";

export default function checkQuantity(item, product) {
  console.log("item🕊️🕊️", item);
  if (item.variantId && product?.variant.length > 0) {
    const variant = product.variant.find(
      (doc) => doc._id.toString() === item.variantId
    );
    console.log("variant🕊️🕊️", variant);

    if (item.quantity > variant.quantity && variant.quantity > 0) {
      console.log("variant quantity🕊️🕊️", variant.quantity);
      item.quantity = variant.quantity;
    } else {
      throw new AppError("Quantity exceeds available stock", 400);
    }
  } else if (item.quantity > product.quantity && product.quantity > 0) {
    console.log("product quantity🕊️🕊️", product.quantity);
    item.quantity = product.quantity;
  } else {
    throw new AppError("Quantity exceeds available stock", 400);
  }
}
