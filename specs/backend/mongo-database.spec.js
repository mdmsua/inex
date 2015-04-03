'use strict';
var MongoDatabase = require('../../modules/mongo-database'),
    url = 'mongodb://localhost:27017/expenses-test';

describe('MongoDatabase', function () {
    var database;

    beforeEach(function () {
        database = new MongoDatabase(url);
    });

    it('should instantiate with default url', function () {
        expect(database.url).toBe(url);
    });

    xit('should not instantiate without url', function () {
        expect(new MongoDatabase).toThrow();
    });

    describe('connects to MongoDB and', function () {
        var error;

        beforeEach(function (done) {
            database.connect(function (err) {
                error = err;
                done();
            });
        });

        it('should succeed', function (done) {
            expect(error).toBeNull();
            expect(database.db).toBeTruthy();
            done();
        });
    });
});