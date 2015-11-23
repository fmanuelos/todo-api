'use strict';

var mongoose = require('mongoose'),
    crypto   = require('crypto');

var Schema = mongoose.Schema;

// define the schema for our user model
var userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  hash_password: {
    type: String,
    required: true
  },
  token: {
    access_token: {
      type: String,
      unique: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// generating a hash
userSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = crypto.randomBytes(128).toString('hex');
  this.hash_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

// Public profile information
userSchema.virtual('profile').get(function() {
  return {
    'email': this.email,
    'role': this.role
  };
});

// encrypt the password
userSchema.methods.encryptPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('base64');
};

// checking if password is valid
userSchema.methods.verifyPassword = function(password) {
  return this.encryptPassword(password) === this.hash_password;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
