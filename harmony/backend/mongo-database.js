'use strict';

var Database = require('./database'),
    MongoClient = require('mongodb').MongoClient;

class MongoDatabase extends Database {
    constructor(url) {
        super(url);
        this.db = null;
    }
    connect(callback) {
        var that = this;
        MongoClient.connect(this.url, function(err, db) {
            if (err) {
                return callback(err);
            }
            that.db = db;
            if (callback && typeof callback === 'function') {
                return callback(null);
            }
        });
    }
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

module.exports = MongoDatabase;