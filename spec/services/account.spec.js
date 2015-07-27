var AccountService = require('../../services/account');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var accountService;
var userid;

describe('Account service', function () {

    beforeEach(function () {
        userid = mongoose.Types.ObjectId();
        mockgoose(mongoose, true);
        accountService = new AccountService(mongoose);
    });

    afterEach(function () {
        accountService = null;
        mockgoose.reset();
    });

    it('should create an account', function (done) {
        var account = {
            amount: 1
        };
        accountService.createAccount(account, userid).then(function (data) {
            expect(data.amount).toBe(account.amount);
            expect(data.name).toBe(account.name);
            expect(data.user).toBe(userid);
            done();
        }).catch(function (error) {
            expect(error).toBeNull();
            done();
        });
    });

});