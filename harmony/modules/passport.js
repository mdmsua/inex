'use strict';

const split = '://';

let FacebookStrategy = require('passport-facebook').Strategy,
    mongoose = require('mongoose'),
    user = require('../schemas/user');

let User = mongoose.model('users', user);

let facebook = (accessToken, refreshToken, profile, done) => {
    return User.findOrCreateProfile(profile).then(data => {
        data[profile.provider]._id = data._id;
        done(null, data[profile.provider]);
    }, error => done(error));
};

module.exports = (passport, host = '') => {
    passport.serializeUser((user, done) => {
        done(null, [user.provider, user.id].join(split));
    });

    passport.deserializeUser((value, done) => {
        let parts = value.split(split),
            provider = parts[0],
            id = parts[1];
        return User.findProfile(provider, id)
            .then(data => {
                if (data === null) {
                    return done(null);
                }
                data[provider]._id = data._id;
                done(null, data[provider]);
            }, error => done(error));
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${host}/auth/facebook/callback`
    }, facebook));
};