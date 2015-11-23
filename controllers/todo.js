/**
 * GET     /todo              ->  index
 * POST    /todo              ->  create
 * GET     /todo/:id          ->  show
 * PUT     /todo/:id          ->  update
 * DELETE  /todo/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Todo = require('../models/todo');

// Get list of todos
exports.index = function(req, res) {
  Todo.find(function (err, todos) {
    if (err) return res.status(500).send(err);
    res.status(200).json(todos);
  });
};

// Creates a new todo in the DB.
exports.create = function(req, res) {
	req.assert('text', '6 to 120 characters required').len(6, 120);
	var err = req.validationErrors();
	if(err) return res.status(400).json(err);

  Todo.create(req.body, function(err, todo) {
    if (err) return res.status(500).send(err);
    return res.status(201).json(todo);
  });
};

// Get a single todo
exports.show = function(req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return res.status(500).send(err);
    if(!todo) { return res.status(404).send('Not Found'); }
    return res.json(todo);
  });
};

// Updates an existing todo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return res.status(500).send(err);
    if(!todo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(todo, req.body);
    updated.save(function (err) {
      if (err) return res.status(500).send(err);
      return res.status(200).json(todo);
    });
  });
};

// Deletes a todo from the DB.
exports.destroy = function(req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return res.status(500).send(err);
    if(!todo) { return res.status(404).send('Not Found'); }
    todo.remove(function(err) {
      if (err) return res.status(500).send(err);
      return res.status(204).send('No Content');
    });
  });
};
