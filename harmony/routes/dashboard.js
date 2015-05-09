'use strict';

let router = require('express').Router(),
    currency = require('../modules/currency'),
    Account = require('../modules/account');

let index = (req, res) => {
    console.log(req.user._id);
    Account.find({user: req.user._id})
        .then(data => {
            req.session.accounts = data;
            let accounts = data.map(account => {
                account.formattedAmount = currency.format(account.amount, account.currency);
                return account;
            });
            return res.render('dashboard/index', {title: 'Expenses', accounts: accounts});
        }
    );
};

router.get('/', index);

module.exports = router;
