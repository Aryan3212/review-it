const { UserModel } = require('../models/userModel');

const isVerified = async (req, res, next) => {
    const currentUser = req.user;
    const userData = await UserModel.findById(currentUser.id);

    if (userData.verified) {
        return next();
    }
    return res.redirect('/');
};

const isNotVerified = async (req, res, next) => {
    const currentUser = req.user;
    const userData = await UserModel.findById(currentUser.id);
    console.log(userData);
    if (!userData.verified) {
        return next();
    }
    return res.redirect('/');
};

module.exports = {
    isVerified,
    isNotVerified
};
