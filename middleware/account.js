'use strict';

let util = require('util');

module.exports = (req, res, next) => {
    let account = req.params.account;
    if (account) {
        let accounts = req.session.accounts;
        if (accounts && util.isArray(accounts)) {
            let filtered = accounts.filter(item => item._id.toString() === account);
            if (filtered.length > 0) {
                req.account = filtered[0];
            }
        }
    }
    next();
};