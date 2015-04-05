'use strict';
var Database = require('../../modules/database'),
    url = 'mongodb://localhost:27017/expenses-test';

function Collection() {
    this.items = [];
    this.findOne = function (item, callback) {
        return callback(null, null);
    };
    this.insertOne = function (item, options, callback) {
        this.items.push(item);
        callback(null);
    }
}

function Db() {
    this._collection = new Collection();
    this.collection = function (name, callback) {
        return callback(name, this._collection);
    }
}

function Client() {
    this.db = new Db();
    this.connect = function (url, callback) {
        return callback(null, this.db);
    }
}

describe('Database', function () {
    var database,
        client = new Client();

    it('should instantiate with default url', function () {
        database = new Database(client, url);
        //expect(database.url).toBe(url);
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
            database.open().then(function () {
                done()
            }).catch(function (err) {
                error = err;
            });
        });

        it('should succeed', function (done) {
            expect(error).toBeNull();
            //expect(database.db).toBeTruthy();
            done();
        });

        it('should not find a document in items collection', function (done) {
            database.findOne('items', {foo: "bar"}).then(function (document) {
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
                expect(document.foo).toBe("bar");
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
    });
});
