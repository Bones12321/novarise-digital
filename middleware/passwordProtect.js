require('dotenv').config();

module.exports = (req, res, next) => {
  // Allow access to static assets, password page, and auth routes without protection
  if (
    req.path === '/password' ||
    req.path.startsWith('/auth') ||    // allow login/register pages
    req.path.startsWith('/public') ||
    req.path.startsWith('/css') ||
    req.path.startsWith('/js') ||
    req.path.startsWith('/images')
  ) {
    return next();
  }

  // If site password already entered in session, allow access
  if (req.session && req.session.sitePasswordEntered) {
    return next();
  }

  // Redirect to password entry page if not authenticated
  return res.redirect('/password');
};
