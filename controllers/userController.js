const { isVerifiedEmail } = require('../services/emailVerificationService');
const {
    registerUserService,
    loginUserService,
    findUserService,
    setUsernameAndPasswordService
} = require('../services/userService');

const logoutUser = async (req, res) => {
    req.logout(() => {
        // flash success
        return res.redirect('/');
    });
};

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    const userWithEmailExists = await findUserService({ email });
    if (userWithEmailExists) {
        // flash error
        return res.redirect('/');
    }
    const isValidEmail = await isVerifiedEmail(email);
    if (!isValidEmail) {
        // flash error
        return res.redirect('/');
    }
    const newUser = await registerUserService({ username, email, password });

    if (!newUser) {
        // flash error
        console.log('Registration failed');
    }
    const result = await loginUserService({ username, password });
    req.login(result, (err) => {
        if (err) {
            // flash error
            return next(err);
        }
        return res.redirect('/');
    });
};

const registerOAuthUser = async (req, res) => {
    const { username, password } = req.body;

    if (!(username && password)) {
        // flash error

        return res.redirect('/users/oauth/finalize');
    }
    const returnedUser = await findUserService({ username });
    if (returnedUser) {
        // flash error
        return res.redirect('/users/oauth/finalize');
    }

    const currentUser = req.user;
    const currentUserToBeProcessed = await findUserService({
        id: currentUser.id
    });
    await setUsernameAndPasswordService({
        user: currentUserToBeProcessed,
        username,
        password
    });
    // flash success
    return res.redirect('/');
};

const toggleVerifyUser = async (req, res) => {
    const currentUser = req.user;
    const newUser = UserModel.findById(currentUser.id);
    newUser.verified = !newUser.verified;
    // flash success
    res.redirect('/');
};
const finalizeUser = async (req, res) => {
    const currentUser = req.user;
    return res.status(200).render('auth/finalize', {
        currentUser
    });
};
const deleteUser = async (req, res) => {
    const { user } = req.user;
    await UserModel.deleteOne({ id: user.id });
    await req.logout();
    // flash success
    res.redirect('/');
};

const updateUser = async (req, res) => {
    const { username, password, email } = req.body;
};
module.exports = {
    registerUser,
    logoutUser,
    updateUser,
    deleteUser,
    finalizeUser,
    registerOAuthUser
};
