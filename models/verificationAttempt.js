import mongoose from 'mongoose';

/**
 * Schema for tracking payment verification attempts
 * Used for rate limiting and protecting against potential misuse
 */
const verificationAttemptSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    success: {
      type: Boolean,
      default: false,
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
verificationAttemptSchema.index({ reference: 1, timestamp: 1 });
verificationAttemptSchema.index({ userId: 1, timestamp: 1 });

// Add TTL index to automatically delete old records after 24 hours
verificationAttemptSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 86400 }
);

export const VerificationAttempt =
  mongoose.models.VerificationAttempt ||
  mongoose.model('VerificationAttempt', verificationAttemptSchema);
