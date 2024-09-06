const express = require('express');
const {
  register,
  verifyEmail,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middlewares');
const router = express.Router();

router.post('/register', register); // User registration
router.get('/verify/:token', verifyEmail); // Email verification
router.post('/login', login); // User login
router.patch('/update-password', protect, changePassword); // Password update (protected)
router.post('/forgot-password', forgotPassword); // Request a password reset
router.put('/reset-password/:token', resetPassword); // Reset password using token

module.exports = router;
