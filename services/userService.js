const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/reviewModel');
const { UserModel } = require('../models/userModel');
const { sanitizeUserInput } = require('../utils');
const ObjectId = require('mongodb').ObjectId;
const findUserService = async (query) => {
    const userFound = await UserModel.findOne(query);
    return userFound;
};

const registerUserService = async ({ username, email, password }) => {
    const sanitizedUsername = sanitizeUserInput(username);
    const sanitizedEmail = sanitizeUserInput(email);

    const userToBeRegistered = new UserModel({
        username: sanitizedUsername,
        email: sanitizedEmail
    });
    return await UserModel.register(userToBeRegistered, password);
};
const loginUserService = async ({ username, password }) => {
    const sanitizedUsername = sanitizeUserInput(username);
    const authenticate = await UserModel.authenticate();
    return await authenticate(sanitizedUsername, password);
};
const setUsernameAndPasswordService = async ({ user, username, password }) => {
    await user.setPassword(password);
    user.username = sanitizeUserInput(username);
    user.verified = true;
    await user.save();
    const authenticate = UserModel.authenticate();
    return await authenticate(user.username, password);
};
const changeUsernameService = async ({ user, username }) => {
    const userFound = findUserService({ username });
    if (!userFound) {
        const userToChange = findUserService({ id: user.id });
        userToChange.username = sanitizeUserInput(username);
        return await userToChange.save();
    } else {
        return null;
    }
};
const changePasswordService = async ({ user, old_password, new_password }) => {
    const userFound = findUserService({ id: user.id });
    if (userFound) return await user.changePassword(old_password, new_password);
    else return null;
};
const deleteUserService = async ({ user }) => {
    await UserModel.deleteOne({ id: user.id });
    const deletedPosts = await PostModel.deleteMany({ author: user.id });
    await ReviewModel.deleteMany({ author: user.id });
    return await Promise.all(
        deletedPosts.map(
            async (post) => await ReviewModel.deleteMany({ post: post.id })
        )
    );
};
module.exports = {
    findUserService,
    registerUserService,
    loginUserService,
    setUsernameAndPasswordService,
    changePasswordService,
    changeUsernameService,
    deleteUserService
};
