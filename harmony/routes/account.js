'use strict';

const currencies = [{
    number: 980,
    code: 'UAH',
    name: 'Ukrainian hryvnia',
    symbol: '₴'
}, {
    number: 840,
    code: 'USD',
    name: 'United States dollar',
    symbol: '$'
}, {
    number: 978,
    code: 'EUR',
    name: 'Euro',
    symbol: '€'
}];

let router = require('express').Router(),
    _ = require('underscore'),
    database;

let getCreate = (req, res) => {
    res.render('account/create', {title: 'Create account', currencies: currencies});
};

let postCreate = (req, res) => {
    let account = req.body;
    account.currency = _.findWhere(currencies, {number: Number(account.currency) });
    account.user_id = req.user._id;
    account.created = new Date();
    account.amount = Number.parseInt(account.amount);
    database.open()
        .then(() => database.insertOne('accounts', account))
        .then(() => database.close())
        .then(() => res.redirect('/dashboard'));
};

module.exports = db => {
    database = db;
    router.get('/create', getCreate);
    router.post('/create', postCreate);
    return router;
};
