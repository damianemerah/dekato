import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    firstname: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /\d{10,}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
addressSchema.index({ userId: 1, isDefault: 1 });

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
