const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      console.log('🚀 Starting authentication process');
      console.log('📧 Email provided:', email);
      console.log('🔐 Password provided:', password ? '[HIDDEN]' : '[NOT PROVIDED]');

      try {
        // Match user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          console.log('❌ No user found with that email');
          return done(null, false, { message: 'That email is not registered' });
        }

        console.log('✅ User found:', user.email);
        console.log('🔒 Comparing passwords...');

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          console.log('✅ Password matched! User authenticated.');
          return done(null, user);
        } else {
          console.log('❌ Password incorrect');
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (err) {
        console.error('💥 Error in authentication:', err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log('💾 Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('📥 Deserializing user with ID:', id);
    try {
      const user = await User.findById(id);
      if (user) {
        console.log('✅ Deserialized user:', user.email);
      } else {
        console.log('❌ No user found on deserialization');
      }
      done(null, user);
    } catch (err) {
      console.error('💥 Error during deserialization:', err);
      done(err, null);
    }
  });
};
