'use strict';

const split = '://';

let FacebookStrategy = require('passport-facebook').Strategy,
    database;

let facebook = (accessToken, refreshToken, profile, done) => {
    delete profile._raw;
    delete profile._json;
    console.log(profile);
    database.findOneAndReplace('profile', {
        $and: [{
            provider: profile.provider,
            id: profile.id
        }]
    }, profile).then((user) => {
        console.log(user);
        done(null, user);
    }).catch((error) => {
        done(error);
    });
};

module.exports = (passport, db) => {
    database = db;

    passport.serializeUser((user, done) => {
        done(null, [user.provider, user.id].join(split));
    });

    passport.deserializeUser((id, done) => {
        var provider = id.split(split)[0],
            username = id.split(split)[1];
        db.findOne('profile', {$and: [{provider: provider, id: username}]}).then((user) => {
            done(null, user);
        }).catch((error) => {
            done(error);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback'
    }, facebook));
};