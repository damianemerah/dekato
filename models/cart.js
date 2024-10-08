import mongoose from "mongoose";
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    checked: { type: Boolean, default: true },
    option: { type: Object },
    variantId: { type: String },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart must belong to a user"],
      unique: true,
    },
    item: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "item",
    populate: {
      path: "productId",
      select:
        "name variant image slug price discount discountPrice discountDuration",
    },
  });
  next();
});

cartSchema.virtual("totalItems").get(function () {
  return this.item.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
});

cartSchema.virtual("totalPrice").get(function () {
  return this.item.reduce((total, item) => {
    if (item.checked) {
      const itemPrice = item.productId.isDiscounted
        ? item.productId.discountPrice
        : item.price;
      return total + itemPrice * item.quantity;
    }
    return total;
  }, 0);
});

cartSchema.virtual("amountSaved").get(function () {
  return this.item.reduce((total, item) => {
    if (item.checked && item.productId.isDiscounted) {
      const regularPrice = item.productId.price;
      const discountPrice = item.productId.discountPrice;
      return total + (regularPrice - discountPrice) * item.quantity;
    }
    return total;
  }, 0);
});

cartItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

cartSchema.plugin(mongooseLeanVirtuals);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export const CartItem =
  mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
