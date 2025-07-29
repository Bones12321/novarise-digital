require('dotenv').config();

module.exports = (req, res, next) => {
  const password = process.env.SITE_PASSWORD;

  // Allow access to static assets and the password page itself without protection
  if (
    req.path === '/password' ||
    req.path.startsWith('/public') ||
    req.path.startsWith('/css') ||
    req.path.startsWith('/js') ||
    req.path.startsWith('/images')
  ) {
    return next();
  }

  // If password already entered in session, allow access
  if (req.session && req.session.authenticated) {
    return next();
  }

  // Redirect to password entry page if not authenticated
  return res.redirect('/password');
};
