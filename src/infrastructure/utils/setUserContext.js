'use strict';

const setUserContext = async (req, res, next) => {
    res.locals.gaClientId = (req.user && req.user.sub) || 'unauthenticated';
    next();
};

module.exports = setUserContext;
