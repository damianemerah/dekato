import mongoose from "mongoose";
import slugify from "slugify";
import Product from "./product.js";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: [String],
  slug: { type: String, unique: true },
  parentId: { type: mongoose.Schema.ObjectId, ref: "Category" },
  products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
