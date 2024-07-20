import mongoose from "mongoose";
// import Product from "./product.js";
// import User from "./user.js";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  checked: { type: Boolean, default: true },
  color: String,
  size: String,
  variantId: String,
  cartId: String,
  createdAt: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Cart must belong to a user"],
    unique: true,
  },
  item: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  createdAt: { type: Date, default: Date.now },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "item",
  });
  next();
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export const CartItem =
  mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
