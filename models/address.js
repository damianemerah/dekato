import mongoose from "mongoose";
import validator from "validator";

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
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "First name contains invalid characters",
      },
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Last name contains invalid characters",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Address contains invalid characters",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: [
        {
          validator: function (v) {
            return /\d{10,}/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
        {
          validator: function (v) {
            return validator.escape(v) === v;
          },
          message: "Phone number contains invalid characters",
        },
      ],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "City contains invalid characters",
      },
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "State contains invalid characters",
      },
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return validator.escape(v) === v;
        },
        message: "Postal code contains invalid characters",
      },
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
