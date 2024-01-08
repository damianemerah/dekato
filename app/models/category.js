import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
  name: String,
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

categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "parentId",
    select: "name slug",
  });
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
