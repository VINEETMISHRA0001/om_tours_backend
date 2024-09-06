// routes/feedback.routes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// POST - Create feedback
router.post('/feedback', feedbackController.createFeedback);

// GET - Get all feedback
router.get('/feedback', feedbackController.getAllFeedback);

// GET - Get feedback by ID
router.get('/feedback/:id', feedbackController.getFeedbackById);

// PUT - Update feedback by ID
router.put('/feedback/:id', feedbackController.updateFeedback);

// DELETE - Delete feedback by ID
router.delete('/feedback/:id', feedbackController.deleteFeedback);

module.exports = router;
