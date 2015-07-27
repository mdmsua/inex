'use strict';

let mongoose = require('mongoose'),
    payment = require('../schemas/payment'),
    Schema = mongoose.Schema;

let account = new Schema({
    name: { type: String, minlength: 1 },
    description: String,
    amount: Number,
    currency: { type: String, minlength: 3, maxlength: 3 },
    user: Schema.Types.ObjectId,
    created: { type: Date, default: Date.now },
    payments: [payment]
});

module.exports = account;