// controllers/feedback.controller.js
const Feedback = require('../models/feedback.model');

// Create Feedback
exports.createFeedback = async (req, res) => {
  try {
    const { stars, comments } = req.body;

    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars',
      });
    }

    const feedback = new Feedback({ stars, comments });
    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ created_at: -1 }); // Sort by most recent
    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    }
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update feedback by ID
exports.updateFeedback = async (req, res) => {
  try {
    const { stars, comments } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars',
      });
    }

    feedback.stars = stars;
    feedback.comments = comments;
    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: 'Feedback not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
