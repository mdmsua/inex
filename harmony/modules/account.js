'use strict';

let db = Symbol('db');

const   accountsCollection = 'accounts',
        paymentsCollection = 'payments';

class Account {
    constructor(database) {
        this[db] = database;
    }

    create(account) {
        return this[db].open()
            .then(() => this[db].insertOne(accountsCollection, account))
            .then(() => this[db].close());
    }

    getAll(user) {
        let accounts = [];
        return this[db].open()
            .then(() => this[db].find(accountsCollection, {user: user}))
            .then(data => {
                accounts = data;
                return this[db].close();
            })
            .then(() => accounts);
    }

    getCurrency(id, user) {
        let currency = null;
        return this[db].open()
            .then(() => this[db].findOne(accountsCollection, {_id: id, user: user}))
            .then(data => {
                currency = data.currency;
                return this[db].close();
            }).then(() => currency);
    }

    getPayments(id, user) {
        let payments = [];
        return this[db].open()
            .then(() => this[db].find(paymentsCollection, {account: id, user: user}))
            .then(data => {
                payments = data;
                return this[db].close();
            }).then(() => payments);
    }
}

module.exports = Account;