import mongoose from "mongoose";
import { CartItem } from "./cart";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789", 10);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        quantity: { type: Number, default: 1, min: 1 },
        option: { type: Object },
        variantId: { type: String },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    receiptNumber: {
      type: String,
      unique: true,
      trim: true,
      default: () => nanoid(),
    },
    status: String,
    type: {
      type: String,
      default: "cart",
      enum: ["cart", "single"],
      required: true,
    },
    shippingMethod: {
      type: String,
      lowercase: true,
      enum: ["pickup", "delivery"],
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: function () {
        return this.shippingMethod === "delivery";
      },
    },
    paymentRef: { type: String, trim: true },
    paymentId: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    currency: { type: String, trim: true, uppercase: true },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
