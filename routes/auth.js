'use strict';
var express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/facebook/', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/' }));

module.exports = router;
