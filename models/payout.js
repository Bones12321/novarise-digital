// models/Payout.js
const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  type: String,
  recipient: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payout', PayoutSchema);
