'use strict';

var winston = require('winston');

var logger = new winston.Logger();

logger.add(winston.transports.Console, {
	name: 'error-file',
	colorize: true,
	prettyPrint: true,
	level: 'debug'
});

module.exports = logger;
