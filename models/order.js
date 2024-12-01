import mongoose from "mongoose";

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
        cartItemId: { type: String },
      },
    ],
    cartItems: [String],
    total: { type: Number, required: true, min: 0 },
    status: String,
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
    deliveryStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "shipped", "delivered", "cancelled"],
    },
    deliveryDate: { type: Date },
    note: { type: String },
    paymentRef: { type: String, trim: true, unique: true, sparse: true },
    paymentId: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    currency: { type: String, trim: true, uppercase: true },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ paymentRef: 1, userId: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
