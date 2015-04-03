'use strict';
var Database = require('./database');
class MemoryDatabase extends Database {
    constructor() {
        super('memory');
    }
}

module.exports = MemoryDatabase;