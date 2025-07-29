const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('password', { error: null });
});

router.post('/', (req, res) => {
  const enteredPassword = req.body.password;
  const sitePassword = process.env.SITE_PASSWORD;

  if (enteredPassword === sitePassword) {
    req.session.authenticated = true;
    res.redirect('/');  // redirect to homepage or wherever you want
  } else {
    res.render('password', { error: 'Incorrect password, please try again.' });
  }
});

module.exports = router;
