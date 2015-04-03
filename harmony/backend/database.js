'use strict';
class Database {
    constructor(url) {
        if (url) {
            this.url = url;
        } else {
            throw new Error('Database URL must be specified');
        }
    }
}

module.exports = Database;