'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    i18n = require('../modules/i18n'),
    account = require('../middleware/account'),
    Account = require('../modules/account'),
    Payment = require('../modules/payment'),
    _ = require('underscore');

let get = (req, res) => {
    res.render('account/create', {title: 'Create account', currencies: currency.list});
};

let post = (req, res) => {
    let account = req.body;
    account.user = req.user._id;
    account.created = new Date();
    account.amount = Number.parseFloat(account.amount);
    Account.create(account)
        .then(res.redirect('/dashboard'))
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
        currencyFormatter = i18n.currencyFormatter(req.account.currency);
    Payment.find({account: account, user: user}).then(data => {
        let payments = data.map(value => {
            value.formattedAmount = currencyFormatter(value.amount);
            return value;
        });
        return res.render('account/payments', {
            title: 'Payments', payments: payments
        });
    });
};

let income = (req, res) => {
};

let expense = (req, res) => {
};

router.get('/create', get);
router.post('/create', post);
router.get('/:account(\\w{24})', account, payments);
router.get('/:account(\\w{24})/+', account, income);
router.get('/:account(\\w{24})/-', account, expense);

module.exports = router;
