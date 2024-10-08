import mongoose from "mongoose";
import slugify from "slugify";

const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Collection name cannot exceed 50 characters"],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

collectionSchema.index({ slug: 1 });
collectionSchema.index({ name: "text", description: "text" });

function arrayLimit(val) {
  return val.length <= 5;
}

collectionSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.name.toLowerCase() === "new") {
    return next(new Error("'new' is a reserved collection name"));
  }
  next();
});

collectionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name && this.isModified("name")) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
});

collectionSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "collection",
  count: true,
});

collectionSchema.plugin(mongooseLeanVirtuals);

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export default Collection;
