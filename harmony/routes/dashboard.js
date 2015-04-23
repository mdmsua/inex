'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    database;

let index = (req, res) => {
    let accounts = [];
    database.open()
        .then(() => database.find('accounts', {user_id: req.user._id}))
        .then(result => {
            accounts = result;
            database.close();
        })
        .then(() => {
            let accs = accounts.map(account => {
                account.numeralAmount = currency.format(account.amount, account.currency);
                return account;
            });
            res.render('dashboard/index', {title: 'Expenses', accounts: accs, user: req.user});
        }
    );
};

module.exports = db => {
    database = db;
    router.get('/', index);
    return router;
};
