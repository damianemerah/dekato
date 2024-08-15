import mongoose from "mongoose";
import slugify from "slugify";

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: [String],
  slug: { type: String, unique: true, index: true },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    default: null,
    index: true,
  },
  children: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
});

categorySchema.index({ parent: 1, slug: 1 });

// Automatically generate slug before saving
categorySchema.pre("save", function (next) {
  if (!this.slug) {
    try {
      this.slug = slugify(this.name, { lower: true });
    } catch (err) {
      return next(new Error("Error generating slug"));
    }
  }
  next();
});

// Export the Category model or use the cached one
export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
