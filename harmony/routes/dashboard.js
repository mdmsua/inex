'use strict';

let router = require('express').Router(),
    database;

let index = (req, res) => {
    let accounts = [];
    database.open()
        .then(() => database.find('accounts', {user_id: req.user._id}))
        .then(result => {
            accounts = result;
            database.close();
        })
        .then(() =>
            res.render('dashboard/index', {title: 'Expenses', accounts: accounts})
    );
};

module.exports = db => {
    database = db;
    router.get('/', index);
    return router;
};
