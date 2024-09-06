const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  no_of_members: {
    type: Number,
    required: true,
  },
  trip_from: {
    type: String,
    required: true,
  },
  trip_to: {
    type: String,
    required: true,
  },
  no_of_days: {
    type: Number,
    required: true,
  },
  professional_details: {
    type: String,
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle', // Reference to the Vehicle model
    required: true,
  },
  proof_document: {
    type: String,
  }, // Path to uploaded proof
  total_booking_price: {
    type: Number,
    required: true, // Assuming it's a required field
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending', // Default status is 'pending'
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
