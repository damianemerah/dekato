import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789", 10);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItem: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
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

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ receiptNumber: 1 }, { unique: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
