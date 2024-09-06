const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const {
  uploadVehicleImages,
  resizeVehicleImages,
  uploadProofDocument,
} = require('../middlewares/multer');

// Booking Routes

// Create a new booking
router.post(
  '/bookings',
  // Upload proof document
  uploadProofDocument,
  bookingController.createBooking
);

// Get all bookings (with vehicle details)
router.get('/bookings', bookingController.getAllBookings);

// Get a single booking by ID (with vehicle details)
router.get('/bookings/:id', bookingController.getBookingById);

// // Update a booking by ID
router.put(
  '/bookings/:id',
  uploadProofDocument, // Handle proof document update
  bookingController.updateBooking
);

// // Delete a booking by ID
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
