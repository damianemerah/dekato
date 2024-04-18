import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: [String],
  slug: { type: String, unique: true },
  parent: { type: mongoose.Schema.ObjectId, ref: "Category", default: null },
  children: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
