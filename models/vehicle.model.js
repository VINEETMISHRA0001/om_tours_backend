const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    }, // Manufacturer
    model: {
      type: String,
      required: true,
      trim: true,
    }, // Model name
    year: {
      type: Number,
      required: true,
    }, // Year of manufacture
    vin: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    }, // Vehicle Identification Number
    color: {
      type: String,
      trim: true,
    }, // Color
    bodyType: {
      type: String,
      trim: true,
    }, // Body type (e.g., Sedan, SUV)
    transmission: {
      type: String,
      trim: true,
    }, // Transmission type (e.g., Automatic, Manual)
    fuelType: {
      type: String,
      trim: true,
    }, // Fuel type (e.g., Gasoline, Diesel)
    dailyRate: {
      type: Number,
      required: true,
    }, // Daily rental rate
    availabilityStatus: {
      type: Boolean,
      default: true,
    }, // Availability for rental
    images: [
      {
        type: String,
      },
    ], // Array of image URLs or paths
    description: { type: String, trim: true }, // Additional information
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
