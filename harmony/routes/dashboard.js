'use strict';

let router = require('express').Router(),
    numeral = require('numeral'),
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
                account.numeralAmount = numeral(account.amount).format('$0,0.00');
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
