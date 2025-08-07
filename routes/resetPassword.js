const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Add bcrypt
const User = require('../models/User'); // Adjust path if needed

// Show reset password form
router.get('/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.send('Password reset token is invalid or has expired.');
    }

    res.render('reset-password', { token: req.params.token, error: null });
  } catch (err) {
    console.error(err);
    res.send('An error occurred.');
  }
});

// Handle new password submission
router.post('/:token', async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.send('Password reset token is invalid or has expired.');
    }

    // 🔐 Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save hashed password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('An error occurred.');
  }
});

module.exports = router;
