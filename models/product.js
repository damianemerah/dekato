import mongoose from "mongoose";
import slugify from "slugify";

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
  cat: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
  tag: [String],
  variant: [
    {
      color: String,
      size: String,
      price: Number,
      quantity: { type: Number, required: true },
      image: String,
    },
  ],
  quantity: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "archived"],
  },
});

productSchema.index({
  price: 1,
  slug: 1,
  cat: 1,
  tag: 1,
  name: "text",
});

productSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });

  if (this.isModified("category")) {
    await this.populate("category");
    if (this.category && this.category.slug) {
      this.cat = this.category.slug;
    } else {
      const error = new Error("Category slug is missing");
      return next(error);
    }
  }
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
