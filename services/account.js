"use strict";

let Account = require('../models/account');
let Payment = require('../models/payment');
let i18n = require('../models/i18n');
let _ = require('underscore');

class AccountService {
    constructor(mongo) {
        this.account = Account(mongo);
    }

    createAccount(account, user) {
        account.user = user;
        account.created = new Date();
        account.amount = Number.parseFloat(account.amount);
        let that = this;
        return new Promise(function (resolve, reject) {
            that.account.create(account, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    static getPayments(account, user, categories, currency) {
        let currencyFormatter = i18n.currencyFormatter(currency);
        let dateFormatter = i18n.dateFormatter({datetime: 'full'});
        return new Promise(function (resolve) {
            Account.findOne({_id: account, user: user})
                .select('payments').sort({'payments.date': -1})
                .then(function (data) {
                    let payments = data.payments.map(function (value) {
                        value.formattedAmount = currencyFormatter(value.amount);
                        value.formattedDate = dateFormatter(value.date);
                        value.category = _.findWhere(categories, {key: value.category}).name;
                        return value;
                    });
                    resolve(payments);
                });
        });
    }

    static handleIncome(payload, account) {
        let payment = new Payment(payload);
        payment.amount = Math.abs(payment.amount);
        return Account.findByIdAndUpdate(account, {
            $push: {payments: payment},
            $inc: {amount: payment.amount}
        });
    }

    static handleTransfer(payload, account) {
        let source = new Payment(payload);
        let destination = new Payment(payload);
        source.amount = -Math.abs(payload.amount);
        destination.amount = Math.abs(payload.amount);
        destination.account = account;
        return Account.collection.bulkWrite([
            {
                updateOne: {
                    filter: {_id: account},
                    update: {
                        $push: {payments: source},
                        $inc: {amount: source.amount}
                    }
                }
            },
            {
                updateOne: {
                    filter: {_id: payload.account},
                    update: {
                        $push: {payments: destination},
                        $inc: {amount: destination.amount}
                    }
                }
            }
        ]);
    }

    static handleExpense(payload, account) {
        let payment = new Payment(payload);
        payment.amount = -Math.abs(payment.amount);
        return Account.findByIdAndUpdate(account, {
            $push: {payments: payment},
            $inc: {amount: payment.amount}
        });
    }
}

module.exports = AccountService;