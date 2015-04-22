'use strict';

var router = require('express').Router();

var index = function index(req, res) {
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
//# sourceMappingURL=index.js.map