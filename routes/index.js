'use strict';

var router = require('express').Router(),
    database = undefined;

var index = function index(req, res) {
    if (req.isAuthenticated()) {
        (function () {
            var accounts = [];
            database.open().then(function () {
                return database.find('accounts', { user_id: req.user._id });
            }).then(function (result) {
                accounts = result;
                database.close();
            }).then(function () {
                return res.render('index', { title: 'Expenses', accounts: accounts });
            });
        })();
    } else {
        res.render('landing', {
            title: 'Expenses'
        });
    }
};

module.exports = function (db) {
    database = db;
    router.get('/', index);
    return router;
};
//# sourceMappingURL=index.js.map