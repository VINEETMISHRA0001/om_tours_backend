// models/feedback.model.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Rating out of 5 stars
  },
  comments: {
    type: String,
    required: true,
    maxlength: 500, // Limit the comments length to 500 characters
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
