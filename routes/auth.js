'use strict';

let router = require('express').Router(),
    passport = require('passport');

let logout = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
};

let failure = (req, res) => {
    res.render('failure', {title: 'Authentication failed'});
};

let facebook = passport.authenticate('facebook', {scope: ['email', 'user_about_me']});

let facebookCallback = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
});

router.get('/facebook/', facebook);
router.get('/facebook/callback', facebookCallback);
router.get('/logout', logout);
router.get('/failure', failure);

module.exports = router;
