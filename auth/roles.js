'use strict';

var ConnectRoles = require('connect-roles');
var user = new ConnectRoles();

//false if the user isn't a user
user.use('access private page', function (req) {
  if (req.user.role === 'supervisor') {
    return true;
  }
});

user.use('user', function (req) {
  if (req.user.role === 'user') {
    return true;
  }
});

//admin users can access all pages
user.use(function (req) {
  if (req.user.role === 'admin') {
    return true;
  }
});

module.exports = user;


