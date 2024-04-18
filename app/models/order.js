import mongoose from "mongoose";
import { CartItem } from "./cart";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],
  total: Number,
  status: {
    type: String,
    default: "pending_payment",
    enum: [
      "pending_payment",
      "payment_confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ],
  },
  shippingMethod: String,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  paymentRef: String,
  paymentId: String,
  paymentMethod: String,
  currency: String,
  paidAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
