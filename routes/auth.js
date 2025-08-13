const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: Send verification email
const sendVerificationEmail = async (email, token, name, host) => {
  const verificationURL = `http://${host}/auth/verify-email/${token}`;
  const mailOptions = {
    from: `"NovaRise Digital" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email for NovaRise Digital',
    html: `
      <h2>Hi ${name},</h2>
      <p>Please verify your email by clicking the link below within 24 hours:</p>
      <p><a href="${verificationURL}">${verificationURL}</a></p>
      <p>If you did not create this account, please ignore this email.</p>
    `
  };
  await transporter.sendMail(mailOptions);
};

// GET: Register
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    cart: req.session.cart || null,
    errors: [],
    name: '',
    email: '',
    password: '',
    password2: ''
  });
});

// POST: Register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push({
      msg: 'Password must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, and 1 special character'
    });
  }

  if (errors.length > 0) {
    return res.render('register', {
      title: 'Register',
      cart: req.session.cart || null,
      errors,
      name,
      email,
      password,
      password2
    });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', {
        title: 'Register',
        cart: req.session.cart || null,
        errors,
        name,
        email,
        password,
        password2
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verified: false,
      verificationToken,
      verificationTokenExpires
    });

    await newUser.save();
    await sendVerificationEmail(newUser.email, verificationToken, newUser.name, req.headers.host);

    req.flash('success_msg', 'Registration successful! Please check your email to verify your account.');
    res.redirect('/auth/login');

  } catch (err) {
    console.error(err);
    errors.push({ msg: 'Something went wrong. Please try again.' });
    res.render('register', {
      title: 'Register',
      cart: req.session.cart || null,
      errors,
      name,
      email,
      password,
      password2
    });
  }
});

// GET: Verify email
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).render('errorPage', { message: 'Invalid or expired verification link.' });
    }

    if (user.verified) {
      return res.status(200).render('errorPage', { message: 'Account already verified.' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.render('successPage', { message: 'Email successfully verified!' });

  } catch (err) {
    console.error('Email verification failed:', err);
    res.status(500).render('errorPage', { message: 'Server error during verification.' });
  }
});

// GET: Login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', cart: req.session.cart || [] });
});

// POST: Login with cart merge and role-based redirect
router.post('/login', async (req, res, next) => {
  let email = '';
  if (req.body && typeof req.body.email === 'string') {
    email = req.body.email.toLowerCase();
    req.body.email = email;
  }

  if (!email) {
    req.flash('error_msg', 'Email is required');
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({ email });
    if (user && !user.verified) {
      req.flash('error_msg', 'Please verify your email before logging in');
      return res.redirect('/auth/login');
    }
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error_msg', 'An error occurred. Please try again.');
    return res.redirect('/auth/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info?.message || 'Login failed');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Merge carts
      if (!req.session.cart) req.session.cart = [];
      if (req.session.tempCart && req.session.tempCart.length) {
        const merged = [...req.session.cart];
        req.session.tempCart.forEach(item => {
          if (!merged.find(p => p.title === item.title)) merged.push(item);
        });
        req.session.cart = merged;
        delete req.session.tempCart;
      }

      // Redirect based on role
      const redirectTo = req.session.returnTo || (user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

// GET: Logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

// GET: Resend verification
router.get('/resend-verification', (req, res) => {
  res.render('resendVerification', {
    title: 'Resend Verification',
    cart: req.session.cart || null,
    errors: [],
    success: null,
    email: ''
  });
});

// POST: Resend verification
router.post('/resend-verification', async (req, res) => {
  let email = '';
  if (req.body && typeof req.body.email === 'string') {
    email = req.body.email.toLowerCase();
  }

  let errors = [];

  try {
    const user = await User.findOne({ email });

    if (!user) {
      errors.push({ msg: 'No account found with that email.' });
      return res.render('resendVerification', {
        title: 'Resend Verification',
        cart: req.session.cart || null,
        errors,
        success: null,
        email
      });
    }

    if (user.verified) {
      return res.render('resendVerification', {
        title: 'Resend Verification',
        cart: req.session.cart || null,
        errors: [],
        success: 'Email is already verified.',
        email
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken, user.name, req.headers.host);

    res.render('resendVerification', {
      title: 'Resend Verification',
      cart: req.session.cart || null,
      errors: [],
      success: 'A new verification email has been sent!',
      email
    });

  } catch (err) {
    console.error(err);
    errors.push({ msg: 'Something went wrong. Try again later.' });
    res.render('resendVerification', {
      title: 'Resend Verification',
      cart: req.session.cart || null,
      errors,
      success: null,
      email
    });
  }
});

module.exports = router;
