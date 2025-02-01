import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          trim: true,
          default: "",
        },
        isFeatured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming there's a Product model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  },
);

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
