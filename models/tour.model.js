// /models/tourModel.js
const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  day: Number,
  location: String,
  description: String,
});

const tourSchema = new mongoose.Schema(
  {
    duration: {
      type: Number,
      required: true,
    },
    destinations: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    trip_overview: {
      type: String,
      required: true,
    },
    trip_highlights: {
      type: [String],
      required: true,
    },
    itinerary: {
      type: [itinerarySchema],
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
      validate: {
        validator: function (v) {
          return v.every((url) => /^(http|https):\/\/[^ "]+$/.test(url));
        },
        message: 'Each image URL must be a valid URL.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
