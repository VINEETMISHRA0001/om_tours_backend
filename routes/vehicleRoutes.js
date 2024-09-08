// routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const {
  uploadVehicleImages,
  resizeVehicleImages,
} = require('../middlewares/multer');

// Routes for Vehicle operations
router.post('/new-vehicle', vehicleController.createVehicle); // Handle image uploads and resizing

router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.put(
  '/vehicles/:id',
  uploadVehicleImages,
  resizeVehicleImages,
  vehicleController.updateVehicle
);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

module.exports = router;
