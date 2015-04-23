'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    database;

let get = (req, res) => {
    res.render('account/create', {title: 'Create account', currencies: currency.list});
};

let post = (req, res) => {
    let account = req.body;
    account.currency = Number(account.currency);
    account.user_id = req.user._id;
    account.created = new Date();
    account.amount = Number.parseFloat(account.amount);
    database.open()
        .then(() => database.insertOne('accounts', account))
        .then(() => database.close())
        .then(() => res.redirect('/dashboard'))
        .catch(error => res.render('account/create', {
            title: 'Create account',
            currencies: currency.list,
            error: error.message,
            model: req.body
        }));
};

module.exports = db => {
    database = db;
    router.get('/create', get);
    router.post('/create', post);
    return router;
};
