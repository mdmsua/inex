let MongoDb = require('mongodb'),
    MongoClient = MongoDb.MongoClient,
    ObjectId = MongoDb.ObjectId,
    _ = require('underscore'),
    Q = require('Q');

let run = url => {
    "use strict";
    MongoClient.connect(url || process.env.MONGODB, (error, db) => {
        db.collection('accounts', (error, accounts) => {
            db.collection('payments', (error, payments) => {
                payments.find().toArray((error, documents) => {
                    let groups = _.groupBy(documents, 'account'),
                        promises = [];
                    Object.keys(groups).forEach(key => {
                        if (key !== 'undefined') {
                            promises.push(Q.nbind(accounts.findOneAndUpdate, accounts)({_id: ObjectId(key)}, {$set: {payments: groups[key]}}));
                        }
                    });
                    Q.all(promises).done(() => {
                        db.dropCollection('payments', () => {
                            console.log('Migration done');
                        });
                    });
                });
            });
        });
    });
};

module.exports = run;