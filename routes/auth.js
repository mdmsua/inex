'use strict';
var router = require('express').Router(),
    passport = require('passport');

function logout(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
}

router.get('/facebook/', passport.authenticate('facebook', {scope: ['email', 'user_about_me']}));
router.get('/facebook/callback', passport.authenticate('facebook', {successRedirect: '/'}));
router.get('/logout', logout);

module.exports = router;
