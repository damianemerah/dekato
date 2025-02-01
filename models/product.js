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
          return /^[\w\s'&-]+$/.test(v);
        },
        message: "Product name contains invalid characters",
      },
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 1000 characters"],
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
      set: function (v) {
        if (isNaN(v)) {
          return undefined;
        }
        return Math.round(v);
      },
    },
    discountDuration: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > Date.now();
        },
        message: "Discount duration must be in the future",
      },
      required: [
        function () {
          return this.discount > 0;
        },
        "Discount duration is required when discount is applied",
      ],
    },
    image: {
      type: [String],
      validate: [
        {
          validator: function (val) {
            return val.length <= 15; // Direct limit check for images
          },
          message: "Images cannot exceed 15",
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
          validator: function (val) {
            return val.length <= 5; // Direct limit check for videos
          },
          message: "Videos cannot exceed 5",
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
          return Array.isArray(v) && v.length > 0 && v.length <= 5;
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
    slug: String,
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
          set: function (v) {
            return Object.fromEntries(
              Object.entries(v).map(([key, val]) => [key, val.toLowerCase()]),
            );
          },
        },
        optionType: [
          {
            labelId: {
              type: [mongoose.Schema.Types.ObjectId],
              ref: "OptionGroup",
            },
            label: {
              type: String,
            },
          },
        ],
        price: {
          type: Number,
          required: [true, "Variant price is required"],
          min: [0, "Variant price cannot be negative"],
          set: (v) => Math.round(v),
        },
        discountPrice: {
          type: Number,
          min: [0, "Variant price cannot be negative"],
          set: function (v) {
            if (isNaN(v)) {
              return undefined;
            }
            return Math.round(v);
          },
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
      default: "inactive",
      enum: {
        values: ["inactive", "active", "archived", "outofstock"],
        message: "{VALUE} is not a valid status",
      },
    },
    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },
    purchaseCount: {
      type: Number,
      default: 0,
      index: true,
    },
    // similarProducts: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    // ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Text indexes for search functionality
productSchema.index(
  { name: "text", description: "text", tag: "text" },
  {
    weights: {
      name: 10, // Name matches are most important
      tag: 5, // Tags are second most important
      description: 1, // Description matches are least important
    },
    name: "search_index",
  },
);
// Compound indexes for common query patterns
productSchema.index({ status: 1, discount: -1, discountDuration: 1 }); // For finding active discounted products
productSchema.index({ category: 1, status: 1 }); // For category browsing - used in getAllProducts
productSchema.index({ campaign: 1, status: 1 }); // For campaign products - used in getAllProducts
productSchema.index({ slug: 1 }, { unique: true }); // For URL-friendly lookups - used in multiple queries
productSchema.index({ status: 1, quantity: 1 }); // // For stock management - used in getAllProducts
productSchema.index({ createdAt: -1 }); // For recent products - used in getAdminProduct

productSchema.index({ status: 1, createdAt: -1 }); // For listing active products by date
productSchema.index({ status: 1, price: 1 }); // For filtering by status and price ranges
// Compound indexes for inventory management

// productSchema.index({ status: 1, sold: -1 }); // For bestsellers lists

// Specific indexes for variant querying
// productSchema.index({ "variant.quantity": 1, status: 1 }); // For variant stock management
// productSchema.index({ "variant.price": 1, status: 1 }); // For variant price filtering

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
    // Ensure category is always an array
    const categoryIds = Array.isArray(doc.category)
      ? doc.category
      : [doc.category];

    const categories = await Category.find({
      _id: { $in: categoryIds },
    }).select("slug");

    if (categories && categories.length > 0) {
      doc.cat = categories.map((cat) => cat.slug);
    } else if (doc.status !== "inactive") {
      throw new Error("At least one category is required to activate product");
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
      if (!doc.discountDuration) {
        throw new Error(
          "Discount duration is required when discount is applied",
        );
      }
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

// Define methods before creating the model
productSchema.methods.findSimilarProducts = async function (
  userActivity,
  limit = 4,
) {
  const categoryIds = this.category.map((cat) => cat.toString());

  const query = {
    _id: { $ne: this._id },
    category: { $in: categoryIds },
    status: "active",
  };

  // Add naughty list filter if userActivity is provided
  if (userActivity?.naughtyList?.length > 0) {
    query._id.$nin = userActivity.naughtyList;
  }

  const products = await this.constructor
    .find(query)
    .sort({ purchaseCount: -1, viewCount: -1, createdAt: -1 })
    .limit(limit)
    .populate("category", "name slug")
    .lean({ virtuals: true });

  return products;
};

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
