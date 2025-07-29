require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passwordProtect = require('./middleware/passwordProtect');

const app = express();

// Routes
const indexRouter = require('./routes/index');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout'); // 👈 new route file for checkout
const authRouter = require('./routes/auth'); // for future login/signup
const dashboardRouter = require('./routes/dashboard'); // for future dashboards
const passwordRouter = require('./routes/password'); // 👈 password entry page route

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup session
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Cart middleware: make cart & item count available in all views
app.use((req, res, next) => {
  const cart = req.session.cart || [];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cart = cart;
  res.locals.cartItemCount = cartItemCount;
  next();
});

// Password entry page - must be before passwordProtect middleware
app.use('/password', passwordRouter);

// Password protection middleware - must be after session and body parsers
app.use(passwordProtect);

// Routes
app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
