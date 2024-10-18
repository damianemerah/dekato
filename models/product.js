import mongoose from "mongoose";
import slugify from "slugify";
import Category from "./category";
import validator from "validator";
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
      minlength: [3, "Product name must be at least 3 characters long"],
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Product name contains invalid characters",
      },
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
      max: [1000000, "Price cannot exceed 1,000,000"],
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
      index: true,
    },
    image: {
      type: [String],
      validate: [
        {
          validator: arrayLimit,
          message: "{PATH} exceeds the limit of 10",
        },
        {
          validator: function (v) {
            return v.every((url) => validator.isURL(url));
          },
          message: "Invalid image URL format or contains invalid characters",
        },
      ],
    },
    video: {
      type: [String],
      validate: [
        {
          validator: arrayLimit,
          message: "{PATH} exceeds the limit of 5",
        },
        {
          validator: function (v) {
            return v.every((url) => validator.isURL(url));
          },
          message: "Invalid video URL format or contains invalid characters",
        },
      ],
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: [true, "Product must belong to at least one category"],
      validate: {
        validator: function (v) {
          return v.length > 0 && v.length <= 5;
        },
        message: "At least one category is required and maximum 5 are allowed",
      },
    },
    campaign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    cat: [String],
    slug: { type: String, index: true },
    tag: [{ type: String, lowercase: true, trim: true }],
    variant: [
      {
        options: {
          type: Object,
          validate: {
            validator: function (v) {
              return Object.values(v).every(
                (val) => validator.escape(val) === val,
              );
            },
            message: "Variant options contain invalid characters",
          },
        },
        price: {
          type: Number,
          required: [true, "Variant price is required"],
          min: [0, "Variant price cannot be negative"],
          max: [1000000, "Variant price cannot exceed 1,000,000"],
          set: (v) => Math.round(v),
        },
        discountPrice: {
          type: Number,
          min: [0, "Variant price cannot be negative"],
          max: [1000000, "Variant price cannot exceed 1,000,000"],
          set: (v) => Math.round(v),
        },
        quantity: {
          type: Number,
          default: 0,
          min: [0, "Variant quantity cannot be negative"],
          max: [1000000, "Variant quantity cannot exceed 1,000,000"],
        },
        image: {
          type: String,
          required: [true, "Variant image is required"],
          validate: {
            validator: function (v) {
              return validator.isURL(v);
            },
            message:
              "Invalid variant image URL format or contains invalid characters",
          },
        },
      },
    ],
    quantity: {
      type: Number,
      min: [0, "Quantity must be a non-negative number"],
      max: [1000000, "Quantity cannot exceed 1,000,000"],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
      max: [1000000, "Sold quantity cannot exceed 1,000,000"],
    },
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

    // Calculate and set discount price for variants
    if (doc.variant && Array.isArray(doc.variant)) {
      doc.variant.forEach((variant) => {
        if (variant.price) {
          variant.discountPrice = Math.round(
            variant.price * (1 - doc.discount / 100),
          );
        }
      });
    }
  } else {
    // If there's no discount, reset discount prices
    doc.discountPrice = undefined;
    doc.discountDuration = undefined;
    if (doc.variant && Array.isArray(doc.variant)) {
      doc.variant.forEach((variant) => {
        variant.discountPrice = undefined;
      });
    }
  }
}

productSchema.plugin(mongooseLeanVirtuals);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
