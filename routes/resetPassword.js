const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path

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

    // Replace with your password hashing logic
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/login');
  } catch (err) {
    res.send('An error occurred.');
  }
});

module.exports = router;
