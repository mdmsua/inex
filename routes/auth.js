'use strict';

var router = require('express').Router(),
    passport = require('passport');

var logout = function logout(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.redirect('/');
};

var failure = function failure(req, res) {
    res.render('failure', { title: 'Authentication failed' });
};

var facebook = passport.authenticate('facebook', { scope: ['email', 'user_about_me'] });

var facebookCallback = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
});

router.get('/facebook/', facebook);
router.get('/facebook/callback', facebookCallback);
router.get('/logout', logout);
router.get('/failure', failure);

module.exports = router;
//# sourceMappingURL=auth.js.map