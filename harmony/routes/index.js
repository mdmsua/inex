'use strict';

let router = require('express').Router(),
    database;

let index = (req, res) => {
    if (req.isAuthenticated()) {
        let accounts = [];
        database.open()
            .then(() => database.find('accounts', {user_id: req.user._id}))
            .then(result => {
                accounts = result;
                database.close();
            })
            .then(() =>
                res.render('index', {title: 'Expenses', accounts: accounts})
        );
    } else {
        res.render('landing', {
            title: 'Expenses'
        });
    }

};

module.exports = db => {
    database = db;
    router.get('/', index);
    return router;
};
