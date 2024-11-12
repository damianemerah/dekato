import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          return /^[\w\s'&-]+$/.test(v);
        },
        message: "Name contains invalid characters",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      validate: {
        validator: function (v) {
          return typeof v === "string";
        },
        message: "Description must be a string",
      },
    },
    image: {
      type: [String],
      maxLength: [15, "Image array cannot exceed 5 elements"],
      validate: {
        validator: function (v) {
          return v.every((url) => validator.isURL(url));
        },
        message: "Invalid URL in image array",
      },
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    path: {
      type: [String],
      required: [true, "Path is required"],
      validate: [(val) => val.length <= 2, "Path can have at most 2 elements"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    pinOrder: {
      type: Number,
      default: 0,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.index({ parent: 1, slug: 1 }, { unique: true });
categorySchema.index({ name: "text", description: "text" });

categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.name.toLowerCase() === "new") {
    return next(new Error("'new' is a reserved category name"));
  }

  if (this.parent) {
    const existingCategory = await this.constructor.findOne({
      parent: this.parent,
      slug: this.slug,
    });
    if (
      existingCategory &&
      existingCategory._id.toString() !== this._id.toString()
    ) {
      return next(
        new Error(
          "Subcategory with this name already exists under the parent category",
        ),
      );
    }
  }

  // Generate path
  if (this.isModified("parent") || this.isModified("slug")) {
    if (!this.parent) {
      this.path = [this.slug];
    } else {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.path = [this.slug, `${parentCategory.slug}/${this.slug}`];
      } else {
        return next(new Error("Parent category not found"));
      }
    }
  }

  next();
});

categorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }

  if (update.parent) {
    const doc = await this.model.findOne(this.getQuery());
    const existingCategory = await this.model.findOne({
      parent: update.parent,
      slug: update.slug,
    });
    if (
      existingCategory &&
      existingCategory._id.toString() !== doc._id.toString()
    ) {
      return next(
        new Error(
          "Subcategory with this name already exists under the parent category",
        ),
      );
    }
  }

  // Update path
  if (update.parent !== undefined || update.slug) {
    const doc = await this.model.findOne(this.getQuery());
    if (!update.parent) {
      update.path = [update.slug || doc.slug];
    } else {
      const parentCategory = await this.model.findById(update.parent);
      if (parentCategory) {
        const newSlug = update.slug || doc.slug;
        update.path = [newSlug, `${parentCategory.slug}/${newSlug}`];
      } else {
        return next(new Error("Parent category not found"));
      }
    }
  }

  next();
});

categorySchema.plugin(mongooseLeanVirtuals);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
