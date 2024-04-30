import mongoose from "mongoose";
import slugify from "slugify";
import dbConnect from "@/utils/mongoConnection";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
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
  currentPrice: {
    type: Number,
  },
  image: [String],
  video: [String],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String },
  tag: [String],
  variant: [
    {
      color: String,
      size: String,
      price: Number,
      quantity: { type: Number, required: true },
      image: String,
    },
  ],
  quantity: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "active", "archived"],
  },
});

productSchema.index({ price: 1, slug: 1 });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export async function watchProductChanges(productId) {
  try {
    console.log("Watching for product changes🚀🚀🚀🚀🚀🚀🚀🚀", productId);

    // Listen for change events using Mongoose change streams
    const changeStream = Product.watch();

    // Handle change events
    changeStream.on("change", async (change) => {
      console.log("Change event:🤑🤑", change);

      // Check if the change event is for the specified productId
      if (change.documentKey._id === productId) {
        // Get the updated product from the database
        const updatedProduct = await Product.findById(productId);

        // Check if the quantity of the product is 0
        if (updatedProduct.quantity === 0) {
          // Update the isSoldOut field to true
          updatedProduct.isSoldOut = true;

          // Save the updated product to the database
          await updatedProduct.save();
        }
      }
    });
  } catch (error) {
    console.error("Error watching for product changes:", error);
  }
}

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
