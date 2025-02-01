import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxLength: [500, "Excerpt cannot exceed 500 characters"],
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
    },
    author: String,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    metaTitle: {
      type: String,
      maxLength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxLength: [160, "Meta description cannot exceed 160 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });

// Add pre-validate middleware to ensure slug is generated before validation
blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
