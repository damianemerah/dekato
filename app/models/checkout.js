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
});

export default mongoose.models.Checkout ||
  mongoose.model("Checkout", checkoutSchema);
