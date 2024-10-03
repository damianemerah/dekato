import mongoose from "mongoose";
import slugify from "slugify";

const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    pinOrder: {
      type: Number,
      default: 0,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.index({ parent: 1, slug: 1 });
categorySchema.index({ name: "text", description: "text" });

function arrayLimit(val) {
  return val.length <= 5;
}

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.name.toLowerCase() === "new") {
    return next(new Error("'new' is a reserved category name"));
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  this.set({ updatedAt: new Date() });
  next();
});

categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
});

categorySchema.plugin(mongooseLeanVirtuals);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
