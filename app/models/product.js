import mongoose from "mongoose";
import slugify from "slugify";
import Category from "./category.js";

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  quantity: Number,
  image: String,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below this regular price",
    },
    default: 0,
  },
  discountDuration: {
    type: Date,
    required: function () {
      return this.discount;
    },
  },
  currentPrice: {
    type: Number,
  },
  image: [String],
  video: [String],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
  tag: [String],
  variant: [variantSchema],
  quantity: { type: Number, required: true },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "archived"],
  },
});

productSchema.index({ price: 1, slug: 1 });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name slug",
  });
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

// Products based on status
