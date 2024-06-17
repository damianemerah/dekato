import mongoose from "mongoose";
import { CartItem } from "@/models/cart";
import Address from "@/models/address";
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
});

export default mongoose.models.Checkout ||
  mongoose.model("Checkout", checkoutSchema);
