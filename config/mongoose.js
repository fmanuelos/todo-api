'use strict';

var mongoose = require('mongoose');
var logger = require('./logger');

exports.connect = function(url) {

  var db = mongoose.connection;

  db.once('open', function () {
    logger.info('Connected ' + db.name + ' DB!');
  });

  db.on('error', function (err) {
    logger.error('Connection error: ' + err.message);
  });

  mongoose.connect(url);
};
