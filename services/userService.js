const { UserModel } = require('../models/userModel');
const ObjectId = require('mongodb').ObjectId;
const findUserService = async (query) => {
    if ('id' in query) {
        query['_id'] = ObjectId(query.id);
        delete query.id;
    }
    const userFound = await UserModel.findOne(query);
    return userFound;
};

const registerUserService = async ({ username, email, password }) => {
    const userToBeRegistered = new UserModel({ username, email });
    return await UserModel.register(userToBeRegistered, password);
};
const loginUserService = async ({ username, password }) => {
    const authenticate = await UserModel.authenticate();
    return await authenticate(username, password);
};
const setUsernameAndPasswordService = async ({ user, username, password }) => {
    await user.setPassword(password);
    user.username = username;
    user.verified = true;
    await user.save();
    const authenticate = UserModel.authenticate();
    return await authenticate(user.username, password);
};

module.exports = {
    findUserService,
    registerUserService,
    loginUserService,
    setUsernameAndPasswordService
};
