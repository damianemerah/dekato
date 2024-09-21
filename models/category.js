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
  pinned: Boolean,
  pinOrder: Number,
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

  //reserver "new" category name
  if (this.name === "new") {
    return next(new Error("Name 'new' is reserved"));
  }
  next();
});

// Virtual property to count the number of products in a category
categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Ensure virtual fields are included in JSON and object responses
categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

// Export the Category model or use the cached one
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
