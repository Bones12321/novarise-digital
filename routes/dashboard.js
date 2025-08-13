const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
// const Payout = require('../models/Payout'); // comment out if you don’t have a model yet

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
router.get('/admin', ensureAuthenticated, checkRole('admin'), async (req, res) => {
  try {
    // Example stats defaults
    const stats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0
    };

    // Fetch users (or empty array)
    const users = await User.find().lean() || [];

    // Fetch products (or empty arrays)
    const products = await Product.find().lean() || [];
    const pendingProducts = products.filter(p => p.status === 'pending') || [];
    const approvedProducts = products.filter(p => p.status === 'approved') || [];
    const rejectedProducts = products.filter(p => p.status === 'rejected') || [];

    // Group products by section
    const productsBySection = {
      1: products.filter(p => p.section === 1) || [],
      2: products.filter(p => p.section === 2) || [],
      3: products.filter(p => p.section === 3) || [],
      4: products.filter(p => p.section === 4) || []
    };

    // Example payouts (empty if model not ready)
    const payouts = []; // or await Payout.find().lean();

    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      cart: req.session.cart || [],
      stats,
      pendingCount: stats.pendingCount,
      approvedCount: stats.approvedCount,
      rejectedCount: stats.rejectedCount,
      users,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      payouts,
      productsBySection
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      cart: req.session.cart || [],
      stats: {},
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      users: [],
      pendingProducts: [],
      approvedProducts: [],
      rejectedProducts: [],
      payouts: [],
      productsBySection: {1:[],2:[],3:[],4:[]}
    });
  }
});

// Seller dashboard route
router.get('/seller', ensureAuthenticated, checkRole('seller'), (req, res) => {
  res.render('seller-dashboard', {
    title: 'Seller Dashboard',
    user: req.user,
    cart: req.session.cart || []
  });
});

// Client dashboard route
router.get('/client', ensureAuthenticated, checkRole('client'), (req, res) => {
  res.render('client-dashboard', {
    title: 'Client Dashboard',
    user: req.user,
    cart: req.session.cart || []
  });
});

module.exports = router;
