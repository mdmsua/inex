'use strict';

let user = (req, res, next) => {
    res.locals.user = req.user;
    next();
};

module.exports = user;