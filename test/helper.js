'use strict';

var config = require('../config/config').test;
var mongoose = require('mongoose');

exports.clearDb = function(done) {
  mongoose.connect(config.mongoose.uri);
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }
  done();
}

exports.disconnect = function(done) {
  mongoose.disconnect(done);
}
