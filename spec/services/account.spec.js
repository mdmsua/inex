var install = require('jasmine-es6/lib/install');
var AccountService = require('../../services/account');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var accountService;

install();

describe('Account service', function (done) {

    beforeEach(function () {
        accountService = new AccountService();
        mockgoose(mongoose);
        mongoose.connect('mongodb://localhost/test');
    });

    afterEach(function () {
        accountService = null;
        mockgoose.reset();
        mongoose.connection.close();
    });

    it('should create account', function () {
        var account = {
            amount: 1
        };
        var user = 1;
        accountService.createAccount(account, user).then(function (data) {
            expect(account.amount).toBe(data.amount);
            done();
        }).catch(function (error) {
            throw error;
        });
    });

});