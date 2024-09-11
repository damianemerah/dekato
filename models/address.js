import mongoose from "mongoose";
// import User from "./user.js";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  address: String,
  phone: String,
  city: String,
  state: String,
  country: { type: String },
  postalCode: String,
  isDefault: { type: Boolean },
});

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
