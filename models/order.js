import mongoose from "mongoose";
import { CartItem } from "./cart";

const singleProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  color: String,
  size: String,
  variantId: String,
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  cartItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],
  singleProduct: {
    type: singleProductSchema,
    required: function () {
      return this.type === "single";
    },
  },
  total: Number,
  status: {
    type: String,
    default: "pending_payment",
    enum: [
      "pending_payment",
      "payment_failed",
      "payment_confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ],
  },
  type: {
    type: String,
    enum: ["cart", "single"],
    required: true,
  },
  shippingMethod: {
    type: String,
    toLowerCase: true,
    enum: ["pickup", "delivery"],
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: function () {
      // Require address if shippingMethod is "delivery"
      return this.shippingMethod === "delivery";
    },
  },
  paymentRef: String,
  paymentId: String,
  paymentMethod: String,
  currency: String,
  paidAt: { type: Date, default: Date.now },
});

// Static method for address requirement check
// orderSchema.statics.isAddressRequired = function (orderData) {
//   return orderData.shippingMethod === "delivery";
// };

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
