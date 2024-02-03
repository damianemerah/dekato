import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below this regular price",
    },
  },
  discountDuration: {
    type: Date,
    required: function () {
      return this.priceDiscount;
    },
  },
  images: [String],
  videos: [String],
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
  tags: [String],
  variants: [
    {
      image: String,
      color: String,
      size: String,
      price: Number,
      quantity: Number,
    },
  ],
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

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

// Products based on status
