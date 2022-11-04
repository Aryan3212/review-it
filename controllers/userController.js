const { isVerifiedEmail } = require('../services/emailVerificationService');
const {
    registerUserService,
    loginUserService,
    findUserService,
    setUsernameAndPasswordService
} = require('../services/userService');

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
        id: currentUser.id
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
    const { user } = req.user;
    await UserModel.deleteOne({ id: user.id });
    await req.logout();
    req.flash('success', 'Successfully deleted account 😼!');
    res.redirect('/');
};

const updateUser = async (req, res) => {
    const { username, password, email } = req.body;
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
    updateUser,
    deleteUser,
    finalizeUser,
    registerOAuthUser
};
