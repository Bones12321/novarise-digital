// middleware/auth.js

module.exports = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Save current URL to redirect after login
  req.session.returnTo = req.originalUrl;

  // Save current cart temporarily before redirecting to login
  if (req.session.cart && req.session.cart.length) {
    req.session.tempCart = req.session.cart;
  }

  res.redirect('/auth/login');
};
