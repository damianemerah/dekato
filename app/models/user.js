import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import Address from "./address.js";
import Wishlist from "./wishlist.js";
import Cart from "./cart.js";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: [true, "Please tell us your name"],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists, please login"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      trim: true,
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      default: "user",
      required: true,
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      validate: [
        validator.isStrongPassword,
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        //This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }).populate("address");
  next();
});

userSchema.pre("save", async function (next) {
  //only run if password is modified
  if (!this.isModified("password")) return next();

  //hash password
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(resetToken, "resetToken🔥");

  //encrypt token and save to database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
