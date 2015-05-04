'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    Account = require('../modules/account'),
    service;

let index = (req, res) => {
    service.getAll(req.user._id)
        .then(data => {
            let accounts = data.map(account => {
                account.formattedAmount = currency.format(account.amount, account.currency);
                return account;
            });
            return res.render('dashboard/index', {title: 'Expenses', accounts: accounts});
        }
    );
};

module.exports = db => {
    service = new Account(db);
    router.get('/', index);
    return router;
};
