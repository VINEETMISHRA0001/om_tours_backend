// /routes/tourRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
} = require('../controllers/tour.controller');

router.post('/', createTour);
router.get('/', getAllTours);
router.get('/:id', getTourById);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);

module.exports = router;
