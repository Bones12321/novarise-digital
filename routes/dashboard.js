const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
// const Order = require('../models/Order'); // uncomment if you have an Order model
// const Payout = require('../models/Payout'); // uncomment if you have a model

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Middleware to check user role
function checkRole(role) {
  return (req, res, next) => {
    if (req.user?.role === role) return next();
    res.status(403).send('Access denied');
  };
}

// Main dashboard route - redirect based on role
router.get('/', ensureAuthenticated, (req, res) => {
  const role = req.user?.role;
  if (role === 'admin') return res.redirect('/dashboard/admin');
  if (role === 'seller') return res.redirect('/dashboard/seller');
  return res.redirect('/dashboard/client');
});

// Admin dashboard route
router.get('/admin', ensureAuthenticated, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find().lean() || [];
    const products = await Product.find().lean() || [];

    const pendingProducts = products.filter(p => p.status === 'pending');
    const approvedProducts = products.filter(p => p.status === 'approved');
    const rejectedProducts = products.filter(p => p.status === 'rejected');

    const stats = {
      totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
      totalOrders: 0, // replace with real orders if available
      totalUsers: users.length,
      pendingCount: pendingProducts.length,
      approvedCount: approvedProducts.length,
      rejectedCount: rejectedProducts.length
    };

    const productsBySection = {
      1: products.filter(p => p.section === 1),
      2: products.filter(p => p.section === 2),
      3: products.filter(p => p.section === 3),
      4: products.filter(p => p.section === 4)
    };

    const payouts = []; // await Payout.find().lean() if model exists

    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user || {},
      cart: req.session.cart || [],
      stats,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      payouts,
      productsBySection,
      users
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user || {},
      cart: req.session.cart || [],
      stats: { totalRevenue: 0, totalOrders: 0, totalUsers: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 },
      pendingProducts: [],
      approvedProducts: [],
      rejectedProducts: [],
      payouts: [],
      productsBySection: { 1: [], 2: [], 3: [], 4: [] },
      users: []
    });
  }
});

// Seller dashboard route
router.get('/seller', ensureAuthenticated, checkRole('seller'), async (req, res) => {
  try {
    const user = req.user || {};
    if (!user.createdAt) user.createdAt = new Date();
    if (!user.refCode) user.refCode = '';

    const affiliate = {
      clicks: 0,
      conversions: 0,
      earnings: 0,
      rate: 0,
      balance: 0
    };

    const products = await Product.find({ seller: user._id }).lean() || [];
    const payouts = []; // await Payout.find({ seller: user._id }).lean() if model exists
    const orders = []; // await Order.find({ seller: user._id }).lean() if model exists

    const pendingProducts = products.filter(p => p.status === 'pending');

    // Compute stats
    const stats = {
      totalRevenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
      totalProducts: products.length,
      pendingProducts: pendingProducts.length
    };

    res.render('seller-dashboard', {
      title: "Partner's Dashboard",
      user,
      cart: req.session.cart || [],
      affiliate,
      products,
      myProducts: products,           // for product table
      pendingProducts,                // for overview card
      payouts,
      orders,                         // for orders table
      stats
    });
  } catch (err) {
    console.error('Seller dashboard error:', err);
    res.render('seller-dashboard', {
      title: "Partner's Dashboard",
      user: { ...req.user, createdAt: new Date(), refCode: '' },
      cart: req.session.cart || [],
      affiliate: { clicks: 0, conversions: 0, earnings: 0, rate: 0, balance: 0 },
      products: [],
      myProducts: [],
      pendingProducts: [],
      payouts: [],
      orders: [],
      stats: { totalRevenue: 0, totalProducts: 0, pendingProducts: 0 }
    });
  }
});

// Client dashboard route
router.get('/client', ensureAuthenticated, checkRole('client'), (req, res) => {
  res.render('client-dashboard', {
    title: 'Client Dashboard',
    user: req.user || {},
    cart: req.session.cart || []
  });
});

module.exports = router;
