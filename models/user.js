import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import Order from "./order.js";
import Product from "@/models/product";
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Please tell us your first name"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Please tell us your last name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      trim: true,
    },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        unique: true,
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: { type: Date, default: Date.now, immutable: true },
    active: { type: Boolean, default: true, select: false },
    // address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ email: 1 });

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  console.log("passwordChangedAt🚀DB🚀", this.passwordChangedAt);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.methods.addToWishlist = function (productId) {
  if (
    !this.wishlist.includes(productId) &&
    mongoose.Types.ObjectId.isValid(productId)
  ) {
    this.wishlist.addToSet(productId);
  }
  return this.save({ validateBeforeSave: false });
};

userSchema.virtual("orderCount", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
  count: true,
});

// userSchema.virtual("amountSpent").get(async function () {
//   const orders = await Order.find({ userId: this._id });
//   return orders.reduce((acc, order) => acc + order.total, 0);
// });

userSchema.plugin(mongooseLeanVirtuals);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
