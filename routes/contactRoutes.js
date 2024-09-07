const express = require('express');
const {
  createContactMessage,
  deleteContactMessage,
  editContactMessage,
  getAllContacts,
} = require('../controllers/contact.controller');

const router = express.Router();

// Route to handle contact form submissions
router.post('/', createContactMessage);

router.delete('/:id', deleteContactMessage);

router.put('/:id', editContactMessage);

// Get all contacts
router.get('/', getAllContacts);

module.exports = router;
