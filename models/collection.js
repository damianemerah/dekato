import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      maxlength: [50, "Campaign name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Campaign name contains invalid characters",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Description contains invalid characters",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    image: {
      type: [String],
      validate: [
        arrayLimit,
        "{PATH} exceeds the limit of 5",
        {
          validator: function (v) {
            return v.every(
              (url) => validator.isURL(url) && validator.escape(url) === url,
            );
          },
          message: "Invalid image URL format or contains invalid characters",
        },
      ],
    },
    banner: {
      type: [String],
      validate: [
        arrayLimit,
        "{PATH} exceeds the limit of 5",
        {
          validator: function (v) {
            return v.every(
              (url) => validator.isURL(url) && validator.escape(url) === url,
            );
          },
          message: "Invalid banner URL format or contains invalid characters",
        },
      ],
    },
    path: {
      type: [String],
      required: [true, "Path is required"],
      validate: [(val) => val.length <= 2, "Path can have at most 2 elements"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    isCampaign: {
      type: Boolean,
      default: true,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

campaignSchema.index({ slug: 1, category: 1 }, { unique: true });
campaignSchema.index({ name: "text", description: "text" });

function arrayLimit(val) {
  return val.length <= 5;
}

campaignSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  if (this.name.toLowerCase() === "new") {
    return next(new Error("'new' is a reserved campaign name"));
  }

  // Generate path
  if (this.isModified("category") || this.isModified("slug")) {
    const categoryDoc = await mongoose
      .model("Category")
      .findById(this.category);
    if (categoryDoc) {
      this.path = [this.slug, `${categoryDoc.slug}/${this.slug}`];
    } else {
      return next(new Error("Category not found"));
    }
  }

  next();
});

campaignSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc && doc.name !== update.name) {
      update.slug = slugify(update.name, {
        lower: true,
        strict: true,
      });
    }
  }

  // Check for duplicate slug within the same category
  if (update.name || update.category) {
    const existingCampaign = await this.model.findOne({
      category: update.category || this._update.category,
      slug: update.slug || this._update.slug,
      _id: { $ne: this._conditions._id },
    });
    if (existingCampaign) {
      return next(
        new Error(
          "A campaign with this name already exists for thea selected category",
        ),
      );
    }
  }

  // Update path
  if (update.category !== undefined || update.slug) {
    const doc = await this.model.findOne(this.getQuery());
    const categoryDoc = await mongoose
      .model("Category")
      .findById(update.category || doc.category);
    if (categoryDoc) {
      const newSlug = update.slug || doc.slug;
      update.path = [newSlug, `${categoryDoc.slug}/${newSlug}`];
    } else {
      return next(new Error("Category not found"));
    }
  }

  next();
});

campaignSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isModified("category")) {
    const existingCampaign = await this.constructor.findOne({
      category: this.category,
      slug: this.slug,
      _id: { $ne: this._id },
    });
    if (existingCampaign) {
      return next(
        new Error(
          "A campaign with this name already exists for the selected category",
        ),
      );
    }
  }
  next();
});

campaignSchema.plugin(mongooseLeanVirtuals);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

export default Campaign;
