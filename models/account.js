'use strict';

let mongoose = require('mongoose'),
    account = require('../schemas/account');

module.exports = mongoose.model('accounts', account);