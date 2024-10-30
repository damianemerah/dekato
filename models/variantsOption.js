import mongoose from "mongoose";

const optionGroupSchema = new mongoose.Schema(
  {
    labelName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    values: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

const OptionGroup =
  mongoose.models.OptionGroup ||
  mongoose.model("OptionGroup", optionGroupSchema);
export default OptionGroup;
