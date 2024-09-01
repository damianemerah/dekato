import mongoose from "mongoose";
import slugify from "slugify";
import Category from "@/models/category";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
    trim: true,
  },
  description: {
    type: String,
    required: function () {
      return this.status !== "draft";
    },
    trim: true,
  },
  price: {
    type: Number,
    required: function () {
      return this.status !== "draft";
    },
    min: 0,
  },
  discount: {
    type: Number,
    validate: {
      validator: function (val) {
        return this.status === "draft" || val < this.price;
      },
      message: "Discount price ({VALUE}) should be below this regular price",
    },
    default: 0,
  },
  discountDuration: {
    type: Date,
    required: function () {
      return this.status !== "draft" && this.discount > 0;
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
      required: [
        function () {
          return this.status !== "draft";
        },
        "Product must belong to a category",
      ],
    },
  ],
  cat: [String],
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
    required: function () {
      return this.status !== "draft";
    },
    min: [0, "Quantity must be a positive number"],
  },
  sold: { type: Number, default: 0 },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "archive"],
  },
});

productSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });

  if (this.isModified("category")) {
    try {
      const categories = await Category.find({
        _id: { $in: this.category },
      }).select("slug");

      if (categories && categories.length > 0) {
        this.cat = categories.map((cat) => cat.slug);
      } else {
        if (this.status !== "draft") {
          throw new Error("At least one category slug is required");
        }
      }
    } catch (error) {
      return next(error);
    }
  }

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
