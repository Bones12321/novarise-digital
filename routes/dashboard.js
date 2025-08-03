const express = require('express');
const router = express.Router();

// Middleware to protect routes (check if logged in)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).send('Access denied');
  };
}

// Main dashboard route - redirect based on role
router.get('/', ensureAuthenticated, (req, res) => {
  const role = req.user.role;

  if (role === 'admin') {
    return res.redirect('/dashboard/admin');
  } else if (role === 'seller') {
    return res.redirect('/dashboard/seller');
  } else {
    return res.redirect('/dashboard/client');
  }
});

// Admin dashboard route
router.get('/admin', ensureAuthenticated, checkRole('admin'), (req, res) => {
  res.render('admin-dashboard', { user: req.user });
});

// Seller dashboard route
router.get('/seller', ensureAuthenticated, checkRole('seller'), (req, res) => {
  res.render('seller-dashboard', { user: req.user });
});

// Client dashboard route
router.get('/client', ensureAuthenticated, checkRole('client'), (req, res) => {
  res.render('client-dashboard', { user: req.user });
});

module.exports = router;
