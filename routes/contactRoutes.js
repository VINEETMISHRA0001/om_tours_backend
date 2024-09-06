const express = require('express');
const { createContactMessage } = require('../controllers/contact.controller');

const router = express.Router();

// Route to handle contact form submissions
router.post('/', createContactMessage);

module.exports = router;
