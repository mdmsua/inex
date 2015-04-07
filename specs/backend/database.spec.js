'use strict';
/* globals describe, it, expect, beforeEach, afterEach */
var Database = require('../../modules/database'),
    Client = process.env.TEST === 'integration' ? require('mongodb').MongoClient : require('./mocks/client.mock'),
    url = 'mongodb://localhost:27017/expenses-test';

describe(process.env.TEST === 'integration' ? '(Integration)' : '(Unit)' + 'Database ', function () {
    var database;

    beforeEach(function () {
        var client = new Client();
        database = new Database(client, url);
    });

    it('should not instantiate without url', function () {
        try {
            database = new Database();
        } catch (error) {
            expect(error.message).toBe('Database URL must be specified');
        }
    });

    describe('connects to MongoDB and', function () {
        var error = null;

        beforeEach(function (done) {
            Database.open().then(function () {
                done();
            }).catch(function (err) {
                error = err;
            });
        });

        it('should not find a document in items collection', function (done) {
            database.findOne('items', {foo: 'bar'}).then(function (document) {
                expect(error).toBeNull();
                expect(document).toBeNull();
                done();
            }).catch(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });

        it('should insert one document to the items collection', function (done) {
            database.insertOne('items', {foo: 'bar'}).then(function (document) {
                expect(error).toBeNull();
                expect(document).toBeTruthy();
                expect(document.foo).toBe('bar');
                expect(document._id).toBeTruthy();
                done();
            }).catch(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });

        it('should insert a document if it was not found', function (done) {
            database.findOneAndInsert('items', {$and: [{foo: 'bar'}]}, {foo: 'bar'}).then(function (document) {
                expect(error).toBeNull();
                expect(document).toBeTruthy();
                expect(document.foo).toBe('bar');
                expect(document._id).toBeTruthy();
                done();
            }).catch(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });

        xit('should update a document if it was found and insert otherwise', function (done) {
            database.findOneAndUpdate('items', {$and: [{foo: 'bar'}]}, {foo: 'bar'}).then(function (document) {
                expect(error).toBeNull();
                expect(document).toBeTruthy();
                expect(document.foo).toBe('bar');
                expect(document._id).toBeTruthy();
                done();
            }).catch(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });

        afterEach(function (done) {
            if (typeof Client.connect === 'undefined') {
                return done();
            }
            Client.connect(url, function (error, db) {
                if (error) {
                    console.error(error);
                } else {
                    if (db.hasOwnProperty('domain')) {
                        db.dropDatabase(function (error) {
                            if (error) {
                                console.log(error);
                            }
                            done();
                        });
                    }
                }
            });
        });
    });
});
