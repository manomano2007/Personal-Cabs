const mongoose = require('mongoose');
const { TRIP_TYPES } = require('../utils/validate');

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    pickupLocation: { type: String, required: true, trim: true, maxlength: 200 },
    dropLocation: { type: String, required: true, trim: true, maxlength: 200 },
    travelDate: { type: String, required: true }, // YYYY-MM-DD
    pickupTime: { type: String, required: true }, // HH:mm (24h)
    passengers: { type: Number, required: true, min: 1, max: 6 },
    tripType: { type: String, required: true, enum: TRIP_TYPES },
    message: { type: String, trim: true, maxlength: 500, default: '' },
    carName: { type: String, trim: true, maxlength: 80, default: 'Mahindra XUV500' },
    // Customer account that made the booking.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // Short, human-friendly reference shown to the customer.
    bookingCode: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['awaiting_payment', 'pending', 'confirmed', 'completed', 'cancelled'],
      default: 'awaiting_payment',
    },
    // ₹200 advance, paid through Razorpay.
    advanceAmount: { type: Number, default: 200 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    paymentFailureReason: { type: String, maxlength: 200 },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
