'use strict';

const split = '://';

let FacebookStrategy = require('passport-facebook').Strategy,
    database;

let facebook = (accessToken, refreshToken, profile, done) => {
    delete profile._raw;
    delete profile._json;
    var provider = profile.provider,
        query = {},
        setop = {};
    setop[provider] = profile;
    query[provider] = {};
    query[provider]['id'] = profile.id;
    database.findOneAndUpdate('users', query, {$set: setop}).then((user) => {
        done(null, user ? user[provider] : null);
    }).catch((error) => {
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
        db.findOne('users', query).then((user) => {
            done(null, user ? user[provider] : null);
        }).catch((error) => {
            done(error);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${host}/auth/facebook/callback`
    }, facebook));
};