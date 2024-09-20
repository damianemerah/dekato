import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import Order from "./order.js";
import Product from "@/models/product";
// import Cart from "./cart.js";

const userSchema = new mongoose.Schema({
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
  emailVerified: { type: Boolean, default: false },
  role: {
    type: String,
    default: "user",
    required: true,
    enum: ["user", "admin"],
  },
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", unique: true },
  ],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    validator: function (value) {
      return validator.isLength(value, { min: 8 });
    },
    message: "Password must be at least 8 characters long",
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
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
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
  //false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  //encrypt token and save to database
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
    this.wishlist.push(productId);
  }
  return this.save({ validateBeforeSave: false });
};

userSchema.virtual("orderCount", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
  count: true,
});
//virtual populate user total spent

// userSchema.virtual("amountSpent").get(async function () {
//   const orders = await Order.find({ userId: this._id });
//   const total = orders.reduce((acc, order) => acc + order.total, 0);

//   return total;
// });

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
