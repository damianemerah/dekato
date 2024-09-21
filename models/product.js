import mongoose from "mongoose";
import slugify from "slugify";
import Category from "./category";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    discountPrice: Number,
    discountDuration: Date,
    image: [String],
    video: [String],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product must belong to a category"],
      },
    ],
    cat: [String],
    createdAt: { type: Date, default: Date.now },
    slug: { type: String, unique: true },
    tag: [{ type: String, lowercase: true }],
    variant: [
      {
        options: {
          type: Object,
        },
        price: Number,
        quantity: {
          type: Number,
          default: 0,
          min: 0,
        },
        image: { type: String, required: true },
      },
    ],
    quantity: {
      type: Number,
      min: [0, "Quantity must be a positive number"],
    },
    sold: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "active", "archive"],
    },
  },
  { timestamps: true },
);

productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.isModified("category")) {
    await updateCategorySlug(this);
  }

  validateAndSetDiscount(this);
  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  if (update.category) {
    await updateCategorySlug(update);
  }

  validateAndSetDiscount(update);
  next();
});

async function updateCategorySlug(doc) {
  try {
    const categories = await Category.find({
      _id: { $in: doc.category },
    }).select("slug");

    if (categories && categories.length > 0) {
      doc.cat = categories.map((cat) => cat.slug);
    } else if (doc.status !== "draft") {
      throw new Error("At least one category slug is required");
    }
  } catch (error) {
    throw error;
  }
}

function validateAndSetDiscount(doc) {
  if (doc.discount) {
    doc.discount = Math.min(doc.discount, 100);
    if (doc.discount > 0 && doc.price) {
      doc.discountPrice = doc.price * (1 - doc.discount / 100);
    } else {
      doc.discountPrice = undefined;
    }
  }
}

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
