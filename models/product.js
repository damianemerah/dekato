import mongoose from "mongoose";
import slugify from "slugify";
import Category from "@/models/category";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
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
  discountPrice: {
    type: Number,
  },
  image: [String],
  video: [String],
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  cat: [
    {
      type: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
  tag: [String],
  variant: [
    {
      options: {
        type: Map,
        of: String,
      },
      price: Number,
      quantity: { type: Number },
      image: String,
    },
  ],
  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity must be a positive number"],
  },
  sold: { type: Number, default: 0 },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "archived"],
  },
});

productSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });

  if (this.isModified("category")) {
    try {
      // Fetch slugs without populating full documents
      const categories = await Category.find({
        _id: { $in: this.category },
      }).select("slug");

      if (categories && categories.length > 0) {
        this.cat = categories.map((cat) => cat.slug);
      } else {
        throw new Error("At least one category slug is required");
      }
    } catch (error) {
      return next(error);
    }
  }

  // Set currentPrice based on discount
  if (this.discount > 0 && this.discountDuration > Date.now()) {
    this.discountPrice = this.price - this.discount;
  } else {
    this.discountPrice = this.price;
  }

  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
