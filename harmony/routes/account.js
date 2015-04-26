'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    _ = require('underscore'),
    database;

let get = (req, res) => {
    res.render('account/create', {title: 'Create account', currencies: currency.list});
};

let post = (req, res) => {
    let account = req.body;
    account.currency = Number(account.currency);
    account.user = req.user._id;
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

let payments = (req, res) => {
    let account = req.params.account,
        user = req.user._id,
        payments = [],
        accountCurrency;
    database.open()
        .then(database.findOne('accounts', {$and: {_id: account, user: user}}, {fields: {currency: 1}}))
        .then(_account => {
            accountCurrency = _.findWhere(currency.list, {number: _account ? _account.currency : 0});
            database.find('payments', {$and: {account: account, user: user}});
        })
        .then(values => {
            payments = values.map(value => {
                value._amount = currency.format(value.amount, accountCurrency ? accountCurrency.number : 0);
                return value;
            });
        })
        .then(() => database.close())
        .then(() => res.render('account/payments', {title: 'Payments', payments: payments}));
};

let income = (req, res) => {
};

let expense = (req, res) => {
};

module.exports = db => {
    database = db;
    router.get('/create', get);
    router.post('/create', post);
    router.get('/:account(\\w{24})', payments);
    router.get('/:account(\\w{24})/+', income);
    router.get('/:account(\\w{24})/-', expense);
    return router;
};
