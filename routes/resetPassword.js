const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Password validation regex
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

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

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.render('reset-password', {
        token: req.params.token,
        error: 'Password must be at least 8 characters long and include a lowercase letter, an uppercase letter, a number, and a special character.'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

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
