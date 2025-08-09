const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/', ensureAuthenticated, async (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.render('checkout', { title: 'Checkout', cart, total });
});

router.post('/place-order', ensureAuthenticated, async (req, res) => {
  const { name, email, address } = req.body;
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // TODO: Save order to DB if needed
  // TODO: Send confirmation email if needed

  // Clear cart after order placed
  req.session.cart = [];

  // Temporary: simulate redirect to payment success
  res.redirect(`/checkout/success`);
});

router.get('/success', ensureAuthenticated, (req, res) => {
  // Cart already cleared on order placement
  res.render('order-success');
});

module.exports = router;
