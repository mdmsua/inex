'use strict';

var MongoClient = require('mongodb').MongoClient;

function noResultCallback(error, callback) {
    if (callback && typeof callback === 'function') {
        return callback(error);
    }
}

function resultCallback(error, result, callback) {
    if (callback && typeof callback === 'function') {
        return callback(error, result);
    }
}

class Database {
    constructor(url) {
        if (url) {
            this.url = url;
            this.db = null;
        } else {
            throw new Error('Database URL must be specified');
        }
    }
    connect(callback) {
        let that = this;
        MongoClient.connect(this.url, (error, db) => {
            if (!error) {
                that.db = db;
            }
            return resultCallback(error, db, callback);
        });
    }
    close(callback) {
        if (this.db) {
            let that = this;
            this.db.close((error) => {
                that.db = null;
                return noResultCallback(error, callback);
            });
        }
        return noResultCallback(null, callback);
    }
}

module.exports = Database;