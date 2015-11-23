'use strict';

var express = require('express');
var passport = require('passport');
var controller = require('../controllers/todo');

var router = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), controller.index);
router.get('/:id', passport.authenticate('bearer', { session: false }),controller.show);
router.post('/', passport.authenticate('bearer', { session: false }), controller.create);
router.put('/:id', passport.authenticate('bearer', { session: false }), controller.update);
router.patch('/:id', passport.authenticate('bearer', { session: false }), controller.update);
router.delete('/:id', passport.authenticate('bearer', { session: false }), controller.destroy);

module.exports = router;
