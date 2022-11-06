const { isVerifiedEmail } = require('../services/emailVerificationService');
const { getPostsService } = require('../services/postService');
const { getReviewsService } = require('../services/reviewService');
const {
    registerUserService,
    loginUserService,
    findUserService,
    setUsernameAndPasswordService,
    changePasswordService,
    changeUsernameService,
    deleteUserService
} = require('../services/userService');

const userProfile = async (req, res) => {
    const user = req.user;
    const userData = findUserService({ id: user.id });
    const posts = await getPostsService({ query: { author: userData.id } });
    const reviews = await getReviewsService({ query: { author: userData.id } });
    const successFlash = req.flash('success')[0];
    const errorFlash = req.flash('error')[0];
    return res.status(200).render('user/profile', {
        title: userData.username + "'s Profile",
        posts,
        reviews,
        currentUser: user && user.verified ? user : null,
        success: successFlash,
        error: errorFlash
    });
};

const logoutUser = async (req, res) => {
    req.logout(() => {
        req.flash('success', 'Successfully logged out 😼.');
        return res.redirect('/');
    });
};

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const userWithEmailExists = await findUserService({ email });
    if (userWithEmailExists) {
        req.flash('error', 'Username taken 😭. Choose another username.');
        return res.redirect('/');
    }
    const isValidEmail = await isVerifiedEmail(email);
    if (!isValidEmail) {
        req.flash('error', `😭 Couldn't verify email.`);
        return res.redirect('/');
    }
    const newUser = await registerUserService({ username, email, password });

    if (!newUser) {
        req.flash('error', `😭 Couldn't register.`);
        console.log('Registration failed');
    }
    const result = await loginUserService({ username, password });
    req.login(result, (err) => {
        if (err) {
            req.flash('error', "Something broke 😭. Couldn't login.");
            return next(err);
        }
        return res.redirect('/');
    });
};

const registerOAuthUser = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = req.user;
    if (!(username && password)) {
        req.flash('error', `😭 Missing username or password.`);
        return res.redirect('/users/oauth/finalize');
    }
    const returnedUser = await findUserService({ username });
    if (returnedUser) {
        req.flash('error', 'Username taken 😭. Choose another username.');
        return res.redirect('/users/oauth/finalize');
    }
    const currentUserToBeProcessed = await findUserService({
        _id: currentUser.id
    });
    await setUsernameAndPasswordService({
        user: currentUserToBeProcessed,
        username,
        password
    });
    req.flash('success', 'Successfully registered 😼!');
    return res.redirect('/');
};

const finalizeUser = async (req, res) => {
    const currentUser = req.user;
    req.flash('success', "Just one more step before you're registered 😼!");
    const successFlash = req.flash('success')[0];
    const errorFlash = req.flash('error')[0];
    return res.status(200).render('auth/finalize', {
        currentUser: currentUser && currentUser.verified ? currentUser : null,
        success: successFlash,
        error: errorFlash
    });
};
const deleteUser = async (req, res) => {
    const { username, password } = req.body;
    const { user } = req.user;
    if (loginUserService({ username, password }))
        await deleteUserService({ user });
    else {
        req.flash('error', 'Something went wrong 😥.');
        res.redirect('users/profile');
    }
    await req.logout();
    req.flash('success', 'Successfully deleted account 😼!');
    res.redirect('/');
};

const changeUsername = async (req, res) => {
    const { username } = req.body;
    const { user } = req.user;
    if (username) {
        const changedUser = changeUsernameService({ user, username });
        if (changedUser) {
            req.flash('success', 'Username changed 😼!');
        } else {
            req.flash('error', 'Something went wrong 😥.');
        }
    } else {
        req.flash('error', 'Something went wrong 😥.');
    }
    res.redirect('users/profile');
};
const changePassword = async (req, res) => {
    const { old_password, new_password } = req.body;
    const { user } = req.user;
    const returnVal = await changePasswordService({
        user,
        old_password,
        new_password
    });
    if (returnVal) {
        req.flash('success', 'Password changed successfully 🤫.');
    } else {
        req.flash('error', 'Something went wrong 😥.');
    }
    res.redirect('users/profile');
};
const toggleVerifyUser = async (req, res) => {
    const currentUser = req.user;
    const newUser = UserModel.findById(currentUser.id);
    newUser.verified = !newUser.verified;
    req.flash('success', 'Successfully toggled verification 😼!');
    res.redirect('/');
};
module.exports = {
    registerUser,
    logoutUser,
    changePassword,
    changeUsername,
    deleteUser,
    finalizeUser,
    userProfile,
    registerOAuthUser
};
