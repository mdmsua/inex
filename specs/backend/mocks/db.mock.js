'use strict';

var Collection = require('./collection.mock');

function Db() {
    this.collections = {};
    this.collection = function (name, callback) {
        var collection = this.collections[name];
        if (!collection) {
            collection = new Collection();
            this.collections[name] = collection;
        }
        return callback(null, collection);
    };
}

module.exports = Db;