const express = require('express');
const router = express.Router();

// Middleware to ensure user is admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'You must be an admin to view that page');
  res.redirect('/auth/login');
}

// GET: Admin Dashboard
router.get('/dashboard', ensureAdmin, (req, res) => {
  // Placeholder stats - replace with real queries later
  const stats = {
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0
  };

  res.render('admin-dashboard', {
    title: 'Admin Dashboard',
    user: req.user,
    cart: req.session.cart || [],
    stats
  });
});

module.exports = router;
