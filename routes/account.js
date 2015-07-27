'use strict';

let router = require('express').Router();
let currency = require('../models/currency');
let account = require('../middleware/account');
let AccountService = require('../services/account');
let moment = require('moment');

const categories = [
    {
        key: 'RNT',
        name: 'Rent',
        income: false
    },
    {
        key: 'NET',
        name: 'Internet',
        income: false
    },
    {
        key: 'PHN',
        name: 'Phone',
        income: false
    },
    {
        key: 'WTR',
        name: 'Water',
        income: false
    },
    {
        key: 'ELC',
        name: 'Electricity',
        income: false
    },
    {
        key: 'GRO',
        name: 'Groceries',
        income: false
    },
    {
        key: 'LUN',
        name: 'Lunch',
        income: false
    },
    {
        key: 'MED',
        name: 'Medicine',
        income: false
    },
    {
        key: 'TRX',
        name: 'Transfer',
        income: false
    },
    {
        key: 'INC',
        name: 'Salary',
        income: true
    }
];

const datetime = 'YYYY-MM-DDTHH:mm';

function get(req, res) {
    res.render('account/create',
        {title: 'Create account', currencies: currency.list});
}

function post(req, res) {
    let account = req.body;
    let user = req.user._id;
    AccountService.createAccount(account, user)
        .then(res.redirect('/dashboard'))
        .catch(function (error) {
            res.render('account/create', {
                title: 'Create account',
                currencies: currency.list,
                error: error.message,
                model: req.body
            });
        });
}

function payments(req, res) {
    let account = req.params.account;
    let user = req.user._id;
    let currency = req.account.currency;
    AccountService.getPayments(account, user, categories, currency).then(function (payments) {
        res.render('account/payments', {
            title: 'Payments', payments: payments
        });
    });
}

function income(req, res) {
    res.render('account/payment', {
        title: 'New income',
        categories: categories.filter(function (c) {
            return c.income;
        }),
        model: {date: moment().format(datetime)},
        min: 1,
        max: Number.MAX_VALUE
    });
}

function expense(req, res) {
    res.render('account/payment', {
            title: 'New expense',
            categories: categories.filter(function (c) {
                return !c.income;
            }),
            model: {date: moment().format(datetime)},
            targets: req.session.accounts
                .filter(function (account) {
                    return account._id.toString() !== req.account._id.toString();
                })
                .map(function (account) {
                    return {
                        id: account._id,
                        name: account.name
                    };
                }),
            min: 1,
            max: req.account.amount
        }
    );
}

function postIncome(req, res) {
    let payload = req.body;
    let account = req.account;
    AccountService.handleIncome(payload, account).then(function () {
        res.redirect('/dashboard');
    });
}

function postExpense(req, res) {
    let payload = req.body;
    let account = req.account;
    if (payload.category === 'TRX') {
        AccountService.handleTransfer(payload, account).then(function () {
            res.redirect('/dashboard');
        });
    } else {
        AccountService.handleExpense(payload, account).then(function () {
            res.redirect('/dashboard');
        });
    }
}

router.get('/create', get);
router.post('/create', post);
router.get('/:account(\\w{24})', account, payments);
router.get('/:account(\\w{24})/\\+', account, income);
router.get('/:account(\\w{24})/-', account, expense);
router.post('/:account(\\w{24})/\\+', account, postIncome);
router.post('/:account(\\w{24})/-', account, postExpense);

module.exports = router;
