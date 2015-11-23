'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Todo
var todoSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Todo', todoSchema);