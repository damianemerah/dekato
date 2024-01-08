import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below this regular price",
    },
  },
  image: [String],
  imageCover: String,
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
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
});

productSchema.index({ price: 1, slug: 1 });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
