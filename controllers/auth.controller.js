const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(req.body); // Add this line to debug the request data

  try {
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only admins can register users.' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });

    const token = user.generateVerificationToken();
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/verify/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking here: ${verificationUrl}`,
    });

    res.status(200).json({
      message:
        'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.error('Invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update this to the correct path to your User model

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received request:', req.body);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user);

    // Ensure that the password comparison uses the correct method
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!user.isVerified) {
      console.log('Email not verified');
      return res.status(400).json({ message: 'Email not verified' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token generated:', token);

    // Send user data (excluding password) and token in response
    res.status(200).json({
      token,
      user: {
        email: user.email,
        name: user.name, // Include other user fields as needed
        // Avoid sending sensitive information such as passwords
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password matches
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password and update it
    user.password = newPassword;

    await user.save(); // This will trigger the passwordChangedAt field update

    // Return response that requires the user to log in again
    res.status(200).json({
      message:
        'Password changed successfully. Please log in again with your new password.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate the reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/reset-password/${resetToken}`;

    // Send email
    const message = `You requested a password reset. Please make a PUT request to: ${resetUrl}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: message,
      });

      res.status(200).json({
        message: `Password reset token sent to email: ${user.email}`,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Error sending email' });
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params; // Extract the token from the URL params

  try {
    // Hash the token to match the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with the matching reset token and check if the token has not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Token is invalid or has expired' });
    }

    // Set the new password and clear the reset token fields
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate a new JWT token for the user
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Send the token in a cookie
    res.cookie('jwt', jwtToken, {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Send cookie securely in production
    });

    res.status(200).json({
      message: 'Password reset successful. Logged in with new password.',
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
