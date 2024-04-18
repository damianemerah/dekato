import mongoose from "mongoose";
import Product from "./product.js";
import User from "./user.js";

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  image: String,
});

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  checked: { type: Boolean, default: true },
  variant: variantSchema,
  createdAt: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Cart must belong to a user"],
    unique: true,
  },
  item: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "item.product",
    select: "name price image",
  });
  next();
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export const CartItem =
  mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
