const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/reviewModel');
const { UserModel } = require('../models/userModel');
const { sanitizeUserInput, sanitizeEmail } = require('../utils');
const { getPostsService } = require('./postService');
const ObjectId = require('mongodb').ObjectId;
const findUserService = async (query) => {
    const userFound = await UserModel.findOne(query);
    return userFound;
};

const registerUserService = async ({ username, email, password }) => {
    const sanitizedUsername = sanitizeUserInput(username);
    const sanitizedEmail = sanitizeEmail(email);

    const userToBeRegistered = new UserModel({
        username: sanitizedUsername,
        email: sanitizedEmail
    });

    const registeredUser = await UserModel.register(
        userToBeRegistered,
        password
    );
    registeredUser.verified = true;
    await registeredUser.save();
    return registeredUser;
};
const loginUserService = async ({ email, password }) => {
    const sanitizedEmail = sanitizeEmail(email);
    const authenticate = await UserModel.authenticate();

    const { user, err } = await authenticate(sanitizedEmail, password);
    return { user, err };
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
    const userFound = await findUserService({ username });
    if (!userFound) {
        const userToChange = await findUserService({ _id: user.id });
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
    const userPosts = await getPostsService({ query: { author: user.id } });
    await Promise.all(
        userPosts.map((post) => {

                ReviewModel.deleteMany({ post: post.id });
                post.remove();

        })
    );
    await ReviewModel.deleteMany({ author: user.id });
    await UserModel.findOneAndDelete({ _id: user.id });

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
