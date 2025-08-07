const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust path if needed

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your gmail address
    pass: process.env.EMAIL_PASS      // app-specific password
  }
});

// Render the forgot password form
router.get('/', (req, res) => {
  res.render('forgot-password', { message: null, error: null });
});

// Handle form submission
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('forgot-password', { error: 'No account found with that email.', message: null });
    }

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetLink = `http://${req.headers.host}/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      html: `<p>You requested a password reset.</p><p>Click here: <a href="${resetLink}">${resetLink}</a></p>`
    });

    res.render('forgot-password', { message: 'Check your email for a reset link.', error: null });

  } catch (err) {
    console.error(err);
    res.render('forgot-password', { error: 'Something went wrong.', message: null });
  }
});

module.exports = router;
