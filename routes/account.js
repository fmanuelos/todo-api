'use strict';

var express  = require('express');
var passport = require('passport');
var user = require('../auth/roles');
var controller = require('../controllers/account');

var router   = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), user.is('admin'), controller.index);
router.get('/me', passport.authenticate('bearer', { session: false }), controller.me);
router.get('/:id', passport.authenticate('bearer', { session: false }), controller.show);
router.put('/:id/password', passport.authenticate('bearer', { session: false }), controller.changePassword);
router.delete('/remove', passport.authenticate('bearer', { session: false }), controller.remove);
router.delete('/:id', passport.authenticate('bearer', { session: false }), user.is('admin'), controller.destroy);
router.post('/token', controller.token);
router.post('/', controller.create);

module.exports = router;
