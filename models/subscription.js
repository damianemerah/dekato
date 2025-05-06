// models/EmailSubscription.ts
import mongoose from "mongoose";
import validator from "validator";
import { nanoid } from "nanoid";

const emailSubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["men", "women", "both"],
        message: "Choose a gender preference: men, women, or both",
      },
      required: [true, "Gender preference is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["subscribed", "unsubscribed"],
        message: "{VALUE} is not a valid status",
      },
      default: "subscribed",
    },
    confirmationToken: {
      type: String,
      unique: true,
      sparse: true,
      default: () => nanoid(32),
    },
    confirmedAt: Date,
    unsubscribedAt: Date,
    lastEmailSent: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
// emailSubscriptionSchema.index({ email: 1 });
emailSubscriptionSchema.index({ status: 1 });
emailSubscriptionSchema.index({ "preferences.gender": 1 });

// Methods
emailSubscriptionSchema.methods.isActive = function () {
  return this.status === "subscribed";
};

export const EmailSubscription =
  mongoose.models.EmailSubscription ||
  mongoose.model("EmailSubscription", emailSubscriptionSchema);
