const Contact = require('../models/contact.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Create a new contact message
exports.createContactMessage = async (req, res) => {
  const { mobile, email, message, thoughts } = req.body;

  if (!mobile || !email || !message || !thoughts) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email address.' });
  }

  try {
    const contact = new Contact({ mobile, email, message, thoughts });
    await contact.save();

    // Send email notification
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_FROM,
      subject: 'New Contact Form Submission',
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Mobile Number:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Thoughts:</strong></p>
        <p>${thoughts}</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to send message.',
        error: error.message,
      });
  }
};

// Delete a contact message by ID
exports.deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found.' });
    }
    res
      .status(200)
      .json({
        success: true,
        message: 'Contact message deleted successfully.',
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to delete contact message.',
        error: error.message,
      });
  }
};

// Edit a contact message by ID
exports.editContactMessage = async (req, res) => {
  const { id } = req.params;
  const { mobile, email, message, thoughts } = req.body;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { mobile, email, message, thoughts },
      { new: true, runValidators: true } // Return the updated document
    );
    if (!updatedContact) {
      return res
        .status(404)
        .json({ success: false, message: 'Contact not found.' });
    }
    res
      .status(200)
      .json({
        success: true,
        message: 'Contact message updated successfully.',
        data: updatedContact,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to update contact message.',
        error: error.message,
      });
  }
};

// Get all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to retrieve contacts.',
        error: error.message,
      });
  }
};
