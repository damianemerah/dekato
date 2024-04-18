import mongoose from "mongoose";
import User from "./user.js";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: String,
  phone: String,
  city: String,
  state: String,
  country: { type: String, default: "Nigeria" },
  postalCode: String,
  isDefault: { type: Boolean },
});

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
