const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  username: {
    type: String,
    required: false,  // Not required initially, but required when signing up as partner
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['admin', 'client', 'seller', 'affiliate'],
    default: 'client',
  },

  verified: {
    type: Boolean,
    default: false, // Users must verify their email before becoming fully registered
  },

  verificationToken: {
    type: String,
    required: false,
  },

  verificationTokenExpires: {
    type: Date,
    required: false,
  },

  resetPasswordToken: {
    type: String,
    required: false,
  },

  resetPasswordExpires: {
    type: Date,
    required: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
