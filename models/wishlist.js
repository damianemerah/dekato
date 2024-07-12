import mongoose from "mongoose";
// import User from "./user";
// import Product from "./product";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  product: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

wishlistSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name price image",
  });
  next();
});

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
