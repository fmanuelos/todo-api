/**
 * Main application file
 */

'use strict';

var express        = require('express'),
  path             = require('path'),
  morgan           = require('morgan'),
  bodyParser       = require('body-parser'),
  cookieParser     = require('cookie-parser'),
  passport         = require('passport'),
  methodOverride   = require('method-override'),
  expressValidator = require('express-validator'),

  roles            = require('./auth/roles'),
  logger           = require('./config/logger'),
  db               = require('./config/mongoose'),
  config           = require('./config/config')[process.env.NODE_ENV || 'development'],


  app              = module.exports = express(),
  port             = process.env.PORT || config.port;

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// set up our express application
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(expressValidator());
app.use(passport.initialize());
app.use(roles.middleware());

require('./auth/auth'); // pass passport for configuration

// routes
app.use('/account', require('./routes/account'));
app.use('/todo', require('./routes/todo'));


app.get('/',function (req, res) {
	res.statusCode = 200;
	res.send('API is running');
});

// catch 404 and forward to error handler
app.use(function(req, res, next){
	res.status(404);
	res.json({
		err: 'Not found'
	});
	return;
});

// error handlers
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		err: err.message
	});
  return;
});

//Start server if we're not someone else's dependency
if (!module.parent) {

	db.connect(config.mongoose.uri);

	app.listen(port, function(){
		logger.info('Express server listening on port ' + port);
	});
}
