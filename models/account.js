'use strict';

let account = require('../schemas/account');

module.exports = function (mongo) {
    return mongo.model('accounts', account);
};