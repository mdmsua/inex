'use strict';

const split = '://';

let FacebookStrategy = require('passport-facebook').Strategy,
    database;

let facebook = (accessToken, refreshToken, profile, done) => {
    delete profile._raw;
    delete profile._json;
    var provider = profile.provider,
        query = {},
        setop = {},
        projection = {};
    setop[provider] = profile;
    projection[provider] = 1;
    projection._id = 1;
    query[provider] = {};
    query[provider]['id'] = profile.id;
    database.open()
        .then(() => database.findOneAndUpdate('users', query, {$set: setop}, {
            returnOriginal: false,
            upsert: true,
            projection: projection
        }))
        .then(user => {
            user[provider]._id = user._id;
            done(null, user[provider]);
        })
        .then(() => database.close())
        .catch(error => {
            done(error);
        });
};

module.exports = (passport, db, host = '') => {
    database = db;

    passport.serializeUser((user, done) => {
        done(null, [user.provider, user.id].join(split));
    });

    passport.deserializeUser((value, done) => {
        var parts = value.split(split),
            provider = parts[0],
            query = {};
        query[`${provider}.id`] = parts[1];
        db.open()
            .then(() => db.findOne('users', query))
            .then(user => {
                done(null, user ? (() => {
                    user[provider]._id = user._id;
                    return user[provider];
                })() : null);
            })
            .then(() => db.close())
            .catch(error => {
                done(error);
            });
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${host}/auth/facebook/callback`
    }, facebook));
};