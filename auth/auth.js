'use strict';

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var config = require('../config/config');

var User = require('../models/user');


passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ 'token.access_token': token }, function(err, user) {
      if (err) return done(err);

      if (!user) return done(null, false, { message: 'Access Denied' });

      if( Math.round((Date.now()-user.token.created)/1000) > config.security.token_life ) {
        return done(null, false, { message: 'Token expired' });
      }

      return done(null, user, { scope: 'read' });
    });
  }
));
