'use strict';

var Db = require('./db.mock');

function Client(db) {
    this.db = db || new Db();
    this.connect = function (url, callback) {
        return callback(null, this.db);
    };
}

module.exports = Client;