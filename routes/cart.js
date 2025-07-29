const express = require('express');
const router = express.Router();

// Show cart page
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart, title: 'Your Shopping Cart' });
});

// Add to cart (AJAX POST)
router.post('/add', (req, res) => {
  const { id, name, price } = req.body;

  // Convert price to a number
  const priceNumber = parseFloat(price);

  // Initialize cart if not present
  if (!req.session.cart) req.session.cart = [];

  // Check if product already exists in cart
  const existing = req.session.cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ id, name, price: priceNumber, quantity: 1 });
  }

  // Calculate total quantity of all items in cart
  const cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);

  // Return JSON response with success and cart count
  res.json({ success: true, cartCount });
});

// Remove from cart
router.post('/remove', (req, res) => {
  const { id } = req.body;
  req.session.cart = req.session.cart.filter(item => item.id !== id);
  res.redirect('/cart');
});

module.exports = router;
