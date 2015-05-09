'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let user = new Schema({
    facebook: Schema.Types.Mixed
});

user.statics.findOrCreateProfile = function(profile, callback) {
    delete profile._raw;
    delete profile._json;
    let provider = profile.provider,
        query = {},
        set = {};
    query[`${provider}.id`] = profile.id;
    set[provider] = profile;
    return this.findOneAndUpdate(query, set, {upsert: true, new: true}, callback);
};

user.statics.findProfile = function(provider, id, callback) {
    let query = {};
    query[`${provider}.id`] = id;
    return this.findOne(query, provider, callback);
};

module.exports = user;