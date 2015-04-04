'use strict';
var Database = require('../../modules/database'),
    url = 'mongodb://localhost:27017/expenses-test';

describe('Database', function () {
    var database;

    it('should instantiate with default url', function () {
        database = new Database(url);
        expect(database.url).toBe(url);
    });

    it('should not instantiate without url', function () {
        try {
            database = new Database();
        } catch (error) {
            expect(error.message).toBe('Database URL must be specified');
        }
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

        afterEach(function (done) {
            database.close(function () {
                done();
            })
        })
    });
});