'use strict';
var express = require('express'),
    router = express.Router(),
    app = express(),
    passport = require('passport');

router.get('/', function (req, res) {
    res.render('index', {
        title: 'Expenses',
        dev: app.get('env') === 'development',
        auth: typeof req.user !== 'undefined'
    });
});

module.exports = router;
