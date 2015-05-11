'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    i18n = require('../modules/i18n'),
    account = require('../middleware/account'),
    Account = require('../modules/account'),
    Payment = require('../modules/payment'),
    moment = require('moment'),
    _ = require('underscore');

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
        currencyFormatter = i18n.currencyFormatter(req.account.currency),
        dateFormatter = i18n.dateFormatter({ datetime: 'full' });
    Payment.find({account: account, user: user}).sort('-date').then(data => {
        let payments = data.map(value => {
            value.formattedAmount = currencyFormatter(value.amount);
            value.formattedDate = dateFormatter(value.date);
            value.category = _.findWhere(categories, { key: value.category }).name;
            return value;
        });
        return res.render('account/payments', {
            title: 'Payments', payments: payments
        });
    });
};

let income = (req, res) => {
    res.render('account/payment', {
        title: 'New income',
        categories: categories.filter(c => c.income),
        model: {date: moment().format(datetime)},
        min: 1,
        max: Number.MAX_SAFE_INTEGER
    });
};

let expense = (req, res) => {
    res.render('account/payment', {
        title: 'New expense',
        categories: categories.filter(c => !c.income),
        model: {date: moment().format(datetime)},
        min: 1,
        max: req.account.amount
    });
};

let postIncome = (req, res) => {
    let payment = new Payment(req.body);
    payment.amount = Math.abs(payment.amount);
    payment.user = req.user._id;
    payment.account = req.account._id;
    payment.save()
        .then(() => Account.findByIdAndUpdate(payment.account, {$inc: {amount: payment.amount}}))
        .then(() => res.redirect('/dashboard'));
};

let postExpense = (req, res) => {
    let payment = new Payment(req.body);
    payment.amount = -Math.abs(payment.amount);
    payment.user = req.user._id;
    payment.account = req.account._id;
    payment.save()
        .then(() => Account.findByIdAndUpdate(payment.account, {$inc: {amount: payment.amount}}))
        .then(() => res.redirect('/dashboard'));
};

router.get('/create', get);
router.post('/create', post);
router.get('/:account(\\w{24})', account, payments);
router.get('/:account(\\w{24})/\\+', account, income);
router.get('/:account(\\w{24})/-', account, expense);
router.post('/:account(\\w{24})/\\+', account, postIncome);
router.post('/:account(\\w{24})/-', account, postExpense);

module.exports = router;
