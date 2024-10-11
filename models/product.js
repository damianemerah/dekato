import mongoose from "mongoose";
import slugify from "slugify";
import Category from "./category";
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      set: (v) => Math.round(v),
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    discountPrice: {
      type: Number,
      min: [0, "Discounted price cannot be negative"],
      set: (v) => Math.round(v),
    },
    discountDuration: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > Date.now();
        },
        message: "Discount duration must be in the future",
      },
    },
    image: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
    video: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Product must belong to at least one category"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one category is required",
      },
    },
    campaign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    cat: [String],
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    slug: { type: String, unique: true, index: true },
    tag: [{ type: String, lowercase: true, trim: true }],
    variant: [
      {
        options: {
          type: Object,
        },
        price: {
          type: Number,
          required: [true, "Variant price is required"],
          min: [0, "Variant price cannot be negative"],
          set: (v) => Math.round(v),
        },
        quantity: {
          type: Number,
          default: 0,
          min: [0, "Variant quantity cannot be negative"],
        },
        image: { type: String, required: [true, "Variant image is required"] },
      },
    ],
    quantity: {
      type: Number,
      min: [0, "Quantity must be a non-negative number"],
      default: 0,
    },
    sold: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      default: "draft",
      enum: {
        values: ["draft", "active", "archive"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

function arrayLimit(val) {
  return val.length <= (this.constructor.name === "image" ? 10 : 5);
}

productSchema.index({ name: "text", description: "text" });

productSchema.virtual("isDiscounted").get(function () {
  return this.discount > 0 && this.discountDuration > Date.now();
});

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
  this.set({ updatedAt: new Date() });
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
      throw new Error(
        "At least one category slug is required for non-draft products",
      );
    }
  } catch (error) {
    throw error;
  }
}

function validateAndSetDiscount(doc) {
  if (doc.discount) {
    doc.discount = Math.min(doc.discount, 100);
    if (doc.discount > 0 && doc.price) {
      doc.discountPrice = Math.round(doc.price * (1 - doc.discount / 100));
    } else {
      doc.discountPrice = undefined;
      doc.discountDuration = undefined;
    }
  }
}

productSchema.plugin(mongooseLeanVirtuals);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
