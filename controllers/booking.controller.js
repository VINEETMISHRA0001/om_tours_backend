const Booking = require('../models/booking.model');
const Vehicle = require('../models/vehicle.model'); // Assuming you have a Vehicle model
const nodemailer = require('nodemailer');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    // Find the vehicle by ID (ensure the vehicle exists)
    const vehicle = await Vehicle.findById(req.body.vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: 'Vehicle not found' });
    }

    // Create new booking with details from the request body
    const booking = new Booking({
      ...req.body,
      vehicle: req.body.vehicleId,
      proof_document: req.file ? `/uploads/docs/${req.file.filename}` : null,
    });
    await booking.save();

    // Send booking confirmation email
    await sendBookingConfirmation(booking, vehicle);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Send Booking Confirmation Email (with Vehicle Info)
const sendBookingConfirmation = async (booking, vehicle) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or any other email service provider
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject: 'Om Tours - Your Tour & Vehicle Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Header Section -->
        <div style="background-color: #0072CE; padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">Om Tours</h1>
          <p style="margin: 0; font-size: 16px;">Your Travel Partner</p>
        </div>
        
        <!-- Order Status Section -->
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 5px;">Your Booking  is Confirmed!</h2>
       
        </div>
        
      
        
        <!-- Trip Details Section -->
        <div style="padding: 20px; border: 1px solid #ddd; margin: 20px 0; background-color: #fff;">
          <h3 style="margin: 0 0 10px; color: #333;">Trip Details</h3>
          <p style="color: #555; margin: 5px 0;"><strong>No. of Members:</strong> ${
            booking.no_of_members
          }</p>
          <p style="color: #555; margin: 5px 0;"><strong>No. of Days:</strong> ${
            booking.no_of_days
          }</p>
          <p style="color: #555; margin: 5px 0;"><strong>Trip From:</strong> ${
            booking.trip_from
          }</p>
          <p style="color: #555; margin: 5px 0;"><strong>Trip To:</strong> ${
            booking.trip_to
          }</p>
        </div>
  
        <!-- Vehicle Details Section -->
        <div style="padding: 20px; border: 1px solid #ddd; margin: 20px 0; background-color: #fff;">
          <h3 style="margin: 0 0 10px; color: #333;">Vehicle Details</h3>
          <p style="color: #555; margin: 5px 0;"><strong>Vehicle Name:</strong> ${
            vehicle.make
          }</p>
          <p style="color: #555; margin: 5px 0;"><strong>Vehicle Model:</strong> ${
            vehicle.model
          }</p>
          <p style="color: #555; margin: 5px 0;"><strong>Vehicle Number:</strong> ${
            vehicle.vin
          }</p>
        </div>
    
        <!-- Track Package Button -->
        <div style="padding: 10px 0; text-align: center;">
          <a href="https://trackinglink.com" style="display: inline-block; padding: 12px 20px; background-color: #0072CE; color: white; text-decoration: none; border-radius: 5px;">Track Package</a>
        </div>
  
        <!-- Footer Section -->
        <div style="background-color: #0072CE; padding: 10px; text-align: center; color: white;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Om Tours. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully.');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

// Get all bookings with vehicle details
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('vehicle');
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a booking by ID with vehicle details
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('vehicle');
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Booking by ID
exports.updateBooking = async (req, res) => {
  try {
    // Find the booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // If a vehicle ID is being updated, ensure the vehicle exists
    if (req.body.vehicleId) {
      const vehicle = await Vehicle.findById(req.body.vehicleId);
      if (!vehicle) {
        return res
          .status(404)
          .json({ success: false, message: 'Vehicle not found' });
      }
      booking.vehicle = req.body.vehicleId; // Update vehicle reference
    }

    // Update other booking details
    Object.assign(booking, req.body);

    // If a new document is uploaded, update the proof_document path
    if (req.file) {
      booking.proof_document = `/uploads/docs/${req.file.filename}`;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Booking by ID
// Delete Booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    // Find the booking by ID and delete it
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
