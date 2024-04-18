import mongoose from "mongoose";
import { CartItem } from "@/app/models/cart";
import Address from "@/app/models/address";
import { toLower } from "lodash";

const checkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],
  total: Number,
  shippingMethod: {
    type: String,
    toLowerCase: true,
    enum: ["pickup", "delivery"],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
});

export default mongoose.models.Checkout ||
  mongoose.model("Checkout", checkoutSchema);
