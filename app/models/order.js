import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
      name: String,
      image: String,
      color: String,
      size: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "cancelled"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.pre("save", function (next) {
  let total = 0;
  for (let i = 0; i < this.products.length; i++) {
    total += this.products[i].quantity * this.products[i].price;
  }
  this.total = total;
  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
