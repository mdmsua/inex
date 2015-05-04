describe('Account service', function () {
    var Account = require('../../modules/account'),
        Database = require('../../modules/database'),
        Client = require('mongodb').MongoClient,
        ObjectID = require('mongodb').ObjectID,
        url = 'mongodb://localhost:27017/test';

    var database = new Database(Client, url),
        account = new Account(database);

    var _collection = 'accounts';

    afterEach(function (done) {
        Client.connect(url, function (error, db) {
            db.dropCollection(_collection, function () {
                done();
            });
        });
    });

    it('should create an account', function (done) {
        var _account = {
            name: 'Test',
            user: new ObjectID()
        };
        account.create(_account).then(function () {
            Client.connect(url, function (error, db) {
                db.collection(_collection, function (error, collection) {
                    collection.findOne({name: _account.name, user: _account.user}, function (error, item) {
                        expect(item.name).toBe(_account.name);
                        expect(item.user).toEqual(_account.user);
                        done();
                    });
                });
            });
        });
    });

    it('should get all accounts for user', function (done) {
        var id = new ObjectID();
        var _accounts = [{
            name: 'Test',
            user: id
        }, {
            name: 'Test',
            user: new ObjectID()
        }];
        Client.connect(url, function (error, db) {
            db.collection(_collection, function (error, collection) {
                collection.insertMany(_accounts, function () {
                    account.getAll(id).then(function (accounts) {
                        expect(accounts.length).toBe(1);
                        expect(accounts[0]).toEqual(jasmine.objectContaining(_accounts[0]));
                        done();
                    });
                });
            });
        });
    });

    it('should get currency for account', function (done) {
        var _account = {
            name: 'Test',
            user: new ObjectID(),
            currency: 'USD'
        };
        Client.connect(url, function (error, db) {
            db.collection(_collection, function (error, collection) {
                collection.insertOne(_account, function (error, result) {
                    account.getCurrency(result.ops[0]._id, _account.user).then(function (currency) {
                        expect(currency).toBeTruthy();
                        expect(currency).toBe(_account.currency);
                        done();
                    });
                });
            });
        });
    });

    it('should get payments for account', function (done) {
        var user = new ObjectID();
        var _account = {
            name: 'Test',
            user: user,
            currency: 'USD'
        };
        Client.connect(url, function (error, db) {
            db.collection(_collection, function (error, collection) {
                collection.insertOne(_account, function (error, result) {
                    var id = result.ops[0]._id;
                    db.collection('payments', function (error, collection) {
                        collection.insertMany([{account: id, user: user}], function () {
                            account.getPayments(id, user).then(function (payments) {
                                expect(payments.length).toBe(1);
                                expect(payments[0].account).toEqual(id);
                                expect(payments[0].user).toEqual(user);
                                done();
                            });
                        })
                    })
                });
            });
        });
    });
});