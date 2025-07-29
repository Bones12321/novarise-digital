const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth'); // if using login
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.render('checkout', { title: 'Checkout', cart, total });
});

router.post('/place-order', async (req, res) => {
  const { name, email, address } = req.body;
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Save order to DB if needed
  // Send confirmation email if needed

  // Temporary: simulate redirect to PayFast
  res.redirect(`/checkout/success`);
});

router.get('/success', (req, res) => {
  // Clear cart session
  req.session.cart = [];
  res.render('order-success'); // allow download from here
});

module.exports = router;
