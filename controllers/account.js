/**
 * GET     /account              ->  index
 * POST    /account              ->  create
 * POST    /account/token        ->  token
 * GET     /account/me           ->  me
 * GET     /account/:id          ->  show
 * PUT     /account/:id/password ->  changePassword
 * DELETE  /account/remove       ->  remove
 * DELETE  /account/:id          ->  destroy
 */

'use strict';

var crypto = require('crypto');

var User = require('../models/user');

//Get list of users, restriction: 'admin'
exports.index = function(req, res) {
  User.find({}, '-salt -hash_password -token', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

// Creates a new user
exports.create = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 6 characters long').len(6);
  var err = req.validationErrors();
  if(err) return res.status(400).json(err);

  var newUser = new User({
    email: req.body.email,
    password: req.body.password,
    token: {
      access_token: crypto.randomBytes(32).toString('hex')
    }
  });

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return next(err);
    if(user) return res.status(400).json([{ msg: 'Account with that email address already exists.' }]);

    newUser.save(function(err, user) {
      if (err) return next(err);
      res.status(201).json({ token: user.token.access_token });
    });
  });
};

// Change a new token
exports.token = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  var err = req.validationErrors();
  if(err) return res.status(400).json(err);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return next(err);
    if(!user || !user.verifyPassword(req.body.password) || req.body.grant_type !== 'password') {
      return res.status(400).json([{ msg: 'Incorrect user/password'}]);
    }

    user.token = {
        access_token: crypto.randomBytes(32).toString('hex'),
        created: Date.now()
    };

    user.save(function(err, user) {
      if (err) return next(err);
      res.status(201).json({ token: user.token.access_token });
    });
  });
};

// Get my info
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({ _id: userId }, '-salt -hash_password -token', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

// Get a single user
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, '-salt -hash_password -token', function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

// Change a users password
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.verifyPassword(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.status(422).json(err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

//Delete my user
exports.remove = function(req, res) {
  var userId = req.user._id;
  User.findByIdAndRemove(userId, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

//Deletes a user, restriction: 'admin'
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};
