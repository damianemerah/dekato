import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // index: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        quantity: { type: Number, default: 1, min: 1 },
        option: { type: Object },
        variantId: { type: String },
        cartItemId: { type: String },
        fulfilledItems: Number,
      },
    ],
    cartItems: [String],
    total: { type: Number, required: true, min: 0 },
    totalItems: Number,
    tracking: String,
    trackingLink: String,
    carrier: String,
    status: String,
    isFulfilled: Boolean,
    shippingMethod: {
      type: String,
      lowercase: true,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: function () {
        return this.shippingMethod === 'delivery';
      },
    },
    deliveryStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    },
    deliveryDate: { type: Date },
    note: { type: String },
    paymentRef: { type: String, trim: true, unique: true, sparse: true },
    paymentId: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },
    currency: { type: String, trim: true, uppercase: true },
    paidAt: { type: Date },
    processingLock: { type: Boolean, default: false },
    processingLockTime: { type: Date },
    verificationAttempts: { type: Number, default: 0 },
    lastVerificationAttempt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ paymentRef: 1, userId: 1 });
orderSchema.index({ userId: 1 }); // Index for user queries
orderSchema.index({ status: 1 }); // Index for status filtering
orderSchema.index({ createdAt: -1 }); // Index for sorting by date
orderSchema.index({ deliveryStatus: 1 }); // Index for delivery status queries
orderSchema.index({ paymentMethod: 1 }); // Index for payment method filtering
orderSchema.index({ 'products.productId': 1 }); // Index for product lookups

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
