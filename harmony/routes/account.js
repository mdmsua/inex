'use strict';

let router = require('express').Router(),
    ObjectID = require('mongodb').ObjectID,
    currency = require('../modules/currency'),
    i18n = require('../modules/i18n'),
    Account = require('../modules/account'),
    _ = require('underscore'),
    service;

let get = (req, res) => {
    res.render('account/create', {title: 'Create account', currencies: currency.list});
};

let post = (req, res) => {
    let account = req.body;
    account.user = req.user._id;
    account.created = new Date();
    account.amount = Number.parseFloat(account.amount);
    service.create(account)
        .then(res.redirect('/dashboard'))
        .catch(error => res.render('account/create', {
            title: 'Create account',
            currencies: currency.list,
            error: error.message,
            model: req.body
        }));
};

let payments = (req, res) => {
    let account = ObjectID(req.params.account),
        user = req.user._id;
    service.getCurrency(account, user).then(code => {
        let currencyFormatter = i18n.currencyFormatter(code);
        return service.getPayments(account, user).then(data => {
            let payments = data.map(value => {
                value.formattedAmount = currencyFormatter(value.amount);
                return value;
            });
            return res.render('account/payments', {
                title: 'Payments', payments: payments
            });
        });
    });
};

let income = (req, res) => {
};

let expense = (req, res) => {
};

module.exports = db => {
    service = new Account(db);
    router.get('/create', get);
    router.post('/create', post);
    router.get('/:account(\\w{24})', payments);
    router.get('/:account(\\w{24})/+', income);
    router.get('/:account(\\w{24})/-', expense);
    return router;
};
