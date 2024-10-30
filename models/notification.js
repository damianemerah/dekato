const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    type: { type: String, enum: ["info", "warning", "error"], default: "info" },
    status: { type: String, enum: ["unread", "read"], default: "unread" },
  },
  {
    timestamps: true,
  },
);

// Add TTL index to automatically delete documents after 30 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
