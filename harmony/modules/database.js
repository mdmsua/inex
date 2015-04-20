'use strict';

let client = Symbol('client'),
    url = Symbol('url'),
    db = Symbol('db');

let collectionInternal = (database, name) =>
    new Promise((resolve, reject) => {
        if (database) {
            database.collection(name, (error, collection) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(collection);
                }
            });
        }
        else {
            reject(new Error('Database is closed'));
        }
    });

let findOneInternal = (collection, query) =>
    new Promise((resolve, reject) => {
        collection.findOne(query, (error, document) => {
            if (error) {
                reject(error);
            } else {
                resolve(document);
            }
        });
    });

let insertOneInternal = (collection, document, options = null) =>
    new Promise((resolve, reject) => {
        collection.insertOne(document, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

let findOneAndUpdateInternal = (collection, filter, update, options = {}) =>
    new Promise((resolve, reject) => {
        collection.findOneAndUpdate(filter, update, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

let findInternal = (collection, query) =>
    new Promise((resolve, reject) => {
        collection.find(query).toArray((error, documents) => {
            if (error) {
                reject(error);
            } else {
                resolve(documents);
            }
        })
    });

class Database {
    constructor(accessClient, accessUrl) {
        if (!accessUrl) {
            throw new Error('Database URL must be specified');
        }
        this[client] = accessClient;
        this[url] = accessUrl;
        this[db] = null;
    }

    open() {
        return new Promise((resolve, reject) => {
            this[client].connect(this[url], (error, database) => {
                if (error) {
                    reject(error);
                }
                else {
                    this[db] = database;
                    resolve();
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this[db].close(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    findOne(collection, query) {
        return collectionInternal(this[db], collection)
            .then(items => findOneInternal(items, query));
    }

    insertOne(collection, document) {
        return collectionInternal(this[db], collection)
            .then(items => insertOneInternal(items, document))
            .then(result => result.ops[0]);
    }

    insertOneQuick(collection, document) {
        return collectionInternal(this[db], collection)
            .then(items => insertOneInternal(items, document, {w: 0}))
            .then(result => result.result && result.result.ok === 1);
    }

    find(collection, query) {
        return collectionInternal(this[db], collection)
            .then(items => findInternal(items, query));
    }

    findOneAndInsert(collectionInternal, query, document) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Connection is closed'));
            }
            collectionInternal(db, collectionInternal).then((items) => {
                items.findOne(query, (error, doc) => {
                    if (error) {
                        reject(error);
                    } else if (doc) {
                        resolve(doc);
                    } else {
                        items.insertOne(document, {w: 1}, (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                if (result.ops.length === 1) {
                                    resolve(result.ops[0]);
                                } else {
                                    resolve(null);
                                }
                            }
                        });
                    }
                });
            });
        });
    }

    findOneAndReplace(collectionInternal, query, document) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Connection is closed'));
            }
            collectionInternal(db, collectionInternal).then((items) => {
                items.findOneAndReplace(query, document, {upsert: true, returnOriginal: false}, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.value);
                    }
                });
            });
        });
    }

    findOneAndUpdate(collection, filter, update, options) {
        return collectionInternal(this[db], collection)
            .then(items => findOneAndUpdateInternal(items, filter, update, options))
            .then(result => result.value);
    }
}

module.exports = Database;