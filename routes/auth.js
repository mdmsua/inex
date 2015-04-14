'use strict';
var router = require('express').Router(),
    passport = require('passport');

function logout(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
}

function failure(req, res) {
    res.render('failure', {title: 'Authentication failed'});
}

router.get('/facebook/', passport.authenticate('facebook', {scope: ['email', 'user_about_me']}));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
}));
router.get('/logout', logout);
router.get('/failure', failure);

module.exports = router;
