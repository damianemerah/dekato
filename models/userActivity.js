import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recentlyViewed: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
        clickCount: {
          type: Number,
          default: 0,
        },
        lastClicked: {
          type: Date,
        },
      },
    ],
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
    naughtyList: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
userActivitySchema.index({ "recentlyViewed.clickCount": -1 });
userActivitySchema.index({ "recentlyViewed.lastClicked": -1 });

// Keep only last 20 viewed products
userActivitySchema.pre("save", function (next) {
  if (this.recentlyViewed.length > 20) {
    // Sort by clickCount and lastClicked before trimming
    this.recentlyViewed.sort((a, b) => {
      if (b.clickCount !== a.clickCount) return b.clickCount - a.clickCount;
      return b.lastClicked - a.lastClicked;
    });
    this.recentlyViewed = this.recentlyViewed.slice(0, 20);
  }
  next();
});

const UserActivity =
  mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
