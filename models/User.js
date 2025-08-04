const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'seller'],
    default: 'client',
  },
  verified: {
    type: Boolean,
    default: false, // Users must verify their email before becoming fully registered
  },
  verificationToken: {
    type: String,
    required: false,  // No longer required
  },
  verificationTokenExpires: {
    type: Date,
    required: false,  // No longer required
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
