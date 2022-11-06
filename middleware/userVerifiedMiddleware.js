const { findUserService } = require('../services/userService');

const isVerified = async (req, res, next) => {
    const currentUser = req.user;
    const userData = await findUserService({ _id: currentUser.id });
    if (userData.verified) {
        return next();
    }
    return res.redirect('/');
};

const isNotVerified = async (req, res, next) => {
    const currentUser = req.user;
    const userData = await findUserService({ _id: currentUser.id });
    if (!userData.verified) {
        return next();
    }
    return res.redirect('/');
};

const getEmail = async (req, res, next) => {
    const { username } = req.body;
    const userData = await findUserService({ username });
    if (userData) {
        req.body['email'] = userData.email;
        return next();
    }
    return res.redirect('/');
};
module.exports = {
    isVerified,
    isNotVerified,
    getEmail
};
