'use strict';

let mongoose = require('mongoose'),
    payment = require('../schemas/payment');

module.exports = mongoose.model('payments', payment);