import mongoose from "mongoose";
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
    checked: { type: Boolean, default: true },
    option: { type: Object },
    variantId: { type: String },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartItemSchema.virtual("currentPrice").get(function () {
  if (!this.product) return 0;

  let price = this.product.price;
  let discountPrice = this.product.discountPrice;

  if (this.variantId && this.product.variant) {
    const variant = this.product.variant.find(
      (v) => v._id.toString() === this.variantId,
    );
    if (variant) {
      price = variant.price;
      discountPrice = variant.discountPrice;
    }
  }

  if (this.product.isDiscounted) {
    return discountPrice || price * (1 - this.product.discount / 100);
  }

  return price;
});

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
      path: "product",
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
    if (item.checked && item.product) {
      return total + item.currentPrice * item.quantity;
    }
    return total;
  }, 0);
});

cartSchema.virtual("amountSaved").get(function () {
  return this.item.reduce((total, item) => {
    if (item.checked && item.product && item.product.discount > 0) {
      let regularPrice = item.product.price;
      if (item.variantId && item.product.variant) {
        const variant = item.product.variant.find(
          (v) => v._id.toString() === item.variantId.toString(),
        );
        if (variant) {
          regularPrice = variant.price;
        }
      }
      return total + (regularPrice - item.currentPrice) * item.quantity;
    }
    return total;
  }, 0);
});

cartSchema.plugin(mongooseLeanVirtuals);
cartItemSchema.plugin(mongooseLeanVirtuals);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export const CartItem =
  mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
