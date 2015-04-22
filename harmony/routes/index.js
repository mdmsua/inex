'use strict';

let router = require('express').Router();

let index = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('landing', {
            title: 'Expenses'
        });
    }

};

router.get('/', index);

module.exports = router;
