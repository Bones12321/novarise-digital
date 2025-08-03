require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passwordProtect = require('./middleware/passwordProtect');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 🔄 Cron job to clean expired tokens
require('./utils/cron');

// Passport config
require('./config/passport')(passport);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup session
app.use(session({
  secret: 'your_secret_key_here', // Change to a strong secret in production!
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg'); 
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Passport uses this on login failure
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Cart middleware
app.use((req, res, next) => {
  const cart = req.session.cart || [];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cart = cart;
  res.locals.cartItemCount = cartItemCount;
  next();
});

// Password entry page - must be before passwordProtect middleware
app.use('/password', require('./routes/password'));

// Password protection middleware
app.use(passwordProtect);

// Routes
app.use('/', require('./routes/index'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
