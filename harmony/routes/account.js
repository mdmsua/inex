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
        accountCurrency,
        currencyFormatter;
    database.open()
        .then(database.findOne('accounts', {$and: {_id: account, user: user}}, {fields: {currency: 1}}))
        .then(_account => {
            accountCurrency = _.findWhere(currency.list, {symbol: _account ? _account.currency : ''});
            currencyFormatter = currency.currencyFormatter(accountCurrency ? accountCurrency.symbol : 'USD');
            database.find('payments', {$and: {account: account, user: user}});
        })
        .then(values => {
            payments = values.map(value => {
                value._amount = currencyFormatter(value.amount);
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
