'use strict';
/* globals describe, it, expect, beforeEach, afterEach, jasmine, xit */
var Q = require('Q'),
    Database = require('../../modules/database'),
    Client = process.env.TEST === 'integration' ? require('mongodb').MongoClient : require('./mocks/client.mock'),
    url = 'mongodb://localhost:27017/test';

function connect() {
    var deferred = Q.defer();
    Client.connect(url, function (error, db) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(db);
        }
    });
    return deferred.promise;
}

function collection(db, name) {
    var deferred = Q.defer();
    db.collection(name, function (error, collection) {
        if (error) {
            deferred.reject(error);
        }
        else {
            deferred.resolve(collection);
        }
    });
    return deferred.promise;
}

function insertOne(collection, item) {
    var deferred = Q.defer();
    collection.insertOne(item, function (error) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function insertMany(collection, items) {
    var deferred = Q.defer();
    collection.insertMany(items, function (error) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

describe((process.env.TEST === 'integration' ? '(Integration)' : '(Unit)') + ' Database', function () {
    var client = new Client(),
        database = new Database(client, url);

    beforeEach(function (done) {
        Client.connect(url, function (error, db) {
            if (db) {
                db.dropCollection('items', function () {
                    done();
                });
            }
        });
    });

    it('should not instantiate without url', function () {
        try {
            database = new Database();
        } catch (error) {
            expect(error.message).toBe('Database URL must be specified');
        }
    });

    it('should find a document in a collection', function (done) {
        connect()
            .then(function (db) {
                return collection(db, 'items');
            })
            .then(function (collection) {
                return insertOne(collection, {foo: 'bar'});
            })
            .then(function () {
                return database.open();
            })
            .then(function () {
                return database.findOne('items', {foo: 'bar'});
            })
            .then(function (document) {
                expect(document).toBeTruthy();
                expect(document.foo).toBe('bar');
                expect(document._id).toBeTruthy();
            })
            .then(function () {
                return database.close();
            })
            .done(function () {
                done();
            });
    });

    it('should not find a document in a collection', function (done) {
        connect()
            .then(function (db) {
                return collection(db, 'items');
            })
            .then(function (collection) {
                return insertOne(collection, {foo: 'bar'});
            })
            .then(function () {
                return database.open();
            })
            .then(function () {
                return database.findOne('items', {foo: 'baz'});
            })
            .then(function (document) {
                expect(document).toBeNull();
            })
            .then(function () {
                return database.close();
            })
            .done(function () {
                done();
            });
    });

    it('should insert one document to a collection', function (done) {
        database.open()
            .then(function () {
                return database.insertOne('items', {foo: 'bar'});
            })
            .then(function (document) {
                expect(document).toEqual(jasmine.objectContaining({foo: 'bar'}));
            })
            .then(function () {
                return database.close();
            })
            .then(function () {
                done();
            });
    });

    it('should insert one document to a collection without write concern', function (done) {
        database.open()
            .then(function () {
                return database.insertOneQuick('items', {foo: 'bar'});
            })
            .then(function (result) {
                expect(typeof result).toBe('boolean');
            })
            .then(function () {
                return database.close();
            })
            .then(function () {
                done();
            });
    });

    it('should find one document, update it, and return null', function (done) {
        database.open()
            .then(function () {
                return database.findOneAndUpdate('items', {foo: 'bar'}, {$set: {foo: 'baz'}});
            })
            .then(function (result) {
                expect(result).toBeNull();
            })
            .then(function () {
                return database.close();
            })
            .then(function () {
                done();
            })
            .catch(function (error) {
                expect(error).toBeNull();
            });
    });

    it('should find one document, upsert it, and return original', function (done) {
        database.open()
            .then(function () {
                return database.findOneAndUpdate('items', {foo: 'bar'}, {$set: {foo: 'baz'}}, {upsert: true});
            })
            .then(function (result) {
                expect(result).toBeNull();
            })
            .then(function () {
                return database.close();
            })
            .catch(function (error) {
                expect(error).toBeNull();
            })
            .then(function () {
                done();
            });
    });

    it('should find one document, upsert it, and return updated', function (done) {
        database.open()
            .then(function () {
                return database.findOneAndUpdate('items', {foo: 'bar'}, {$set: {foo: 'baz'}}, {
                    upsert: true,
                    returnOriginal: false
                });
            })
            .then(function (result) {
                expect(result).not.toBeNull();
                expect(result).toEqual(jasmine.objectContaining({foo: 'baz'}));
            })
            .then(function () {
                return database.close();
            })
            .catch(function (error) {
                expect(error).toBeNull();
            })
            .then(function () {
                done();
            });
    });

    it('should find one document, update it, and return updated', function (done) {
        connect()
            .then(function (db) {
                return collection(db, 'items');
            })
            .then(function (items) {
                return insertOne(items, {foo: 'bar'});
            })
            .then(function () {
                return database.open();
            })
            .then(function () {
                return database.findOneAndUpdate('items', {foo: 'bar'}, {$set: {foo: 'baz'}}, {
                    returnOriginal: false,
                    projection: {foo: 1}
                });
            })
            .then(function (result) {
                expect(result).toEqual(jasmine.objectContaining({foo: 'baz'}));
            })
            .then(function () {
                return database.close();
            })
            .then(function () {
                done();
            })
            .catch(function (error) {
                expect(error.message).toBeUndefined();
                done();
            });
    });

    it('should find documents', function (done) {
        connect()
            .then(function (db) {
                return collection(db, 'items');
            })
            .then(function (items) {
                return insertMany(items, [{foo: 'bar'}, {foo: 'baz'}, {foo: 'bar'}]);
            })
            .then(function () {
                return database.open();
            })
            .then(function () {
                return database.find('items', {foo: 'bar'});
            })
            .then(function (result) {
                expect(result.length).toEqual(2);
                expect(result.every(function (n) {
                    return n.foo === 'bar';
                })).toBeTruthy();
            })
            .then(function () {
                return database.close();
            })
            .then(function () {
                done();
            })
            .catch(function (error) {
                expect(error.message).toBeUndefined();
                done();
            });
    });

    xit('should insert a document if it was not found', function (done) {
        database.findOneAndInsert('items', {$and: [{foo: 'bar'}]}, {foo: 'bar'}).then(function (document) {
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
        Client.connect(url, function (error, db) {
            if (db) {
                db.dropCollection('items', function () {
                    done();
                });
            }
        });
    });

    //afterEach(function (done) {
    //    Client.connect(url, function (error, db) {
    //        if (error) {
    //            console.error(error);
    //        } else {
    //            if (db.hasOwnProperty('domain')) {
    //                db.dropDatabase(function (error) {
    //                    if (error) {
    //                        console.log(error);
    //                    }
    //                    done();
    //                });
    //            }
    //        }
    //    });
    //});
});
