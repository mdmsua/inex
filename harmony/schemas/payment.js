'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let payment = new Schema({
    date: {type: Date, default: Date.now},
    amount: Number,
    category: String,
    description: String,
    transfer: {source: Schema.Types.ObjectId, destination: Schema.Types.ObjectId},
    exchange: {currency: {type: String, minlength: 3, maxlength: 3}, amount: Number},
    user: Schema.Types.ObjectId,
    account: Schema.Types.ObjectId
});

module.exports = payment;