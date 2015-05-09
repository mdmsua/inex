'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let payment = new Schema({
    date: {type: Date, default: Date.now},
    amount: Number,
    category: {name: String, type: Boolean},
    description: String,
    user: Schema.Types.ObjectId,
    account: Schema.Types.ObjectId
});

module.exports = payment;