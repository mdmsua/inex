'use strict';

var client,
    url,
    db;

function onConnect(resolve, reject) {
    client.connect(url, (error, database) => {
        if (error) {
            reject(error);
        }
        else {
            db = database;
            resolve(database);
        }
    });
}

function onClose(resolve, reject) {
    if (db) {
        db.close((error) => {
            db = null;
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    }
    resolve();
}

function getCollection(db, collection) {
    return new Promise((resolve, reject) => {
        db.collection(collection, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    });
}

class Database {
    constructor(_client, _url = process.env.MONGODB) {
        if (_url) {
            client = _client;
            url = _url;
        } else {
            throw new Error('Database URL must be specified');
        }
    }
    open() {
        return new Promise(onConnect);
    }
    close() {
        return new Promise(onClose);
    }
    findOne(collection, query) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Connection is closed'));
            }
            getCollection(db, collection).then((items) => {
                items.findOne(query, (error, document) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(document);
                    }
                });
            })
        });
    }
    insertOne(collection, document) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Connection is closed'));
            }
            getCollection(db, collection).then((items) => {
                items.insertOne(document, { w: 1 }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (result.insertedCount === 1) {
                            resolve(result.ops[0]);
                        } else {
                            resolve(null);
                        }
                    }
                });
            })
        });
    }
    findOneAndInsert(collection, query, document) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Connection is closed'));
            }
            getCollection(db, collection).then((items) => {
                items.findOne(query, (error, doc) => {
                    if (error) {
                        reject(error);
                    } else if (doc) {
                        resolve(doc);
                    } else {
                        items.insertOne(document, { w: 1 }, (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                if (result.insertedCount === 1) {
                                    resolve(result.ops[0]);
                                } else {
                                    resolve(null);
                                }
                            }
                        });
                    }
                });
            })
        });
    }
}

module.exports = Database;