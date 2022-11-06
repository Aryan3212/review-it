const { Router } = require('express');
const {
    registerUser,
    logoutUser,
    deleteUser,
    finalizeUser,
    registerOAuthUser,
    changePassword,
    changeUsername,
    userProfile
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { catchAsync } = require('../utils');
const passport = require('passport');
const { UserModel } = require('../models/userModel');
const {
    isNotVerified,
    isVerified,
    getEmail
} = require('../middleware/userVerifiedMiddleware');
const router = new Router();

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

router.route('/').delete(catchAsync(isAuthenticated), catchAsync(deleteUser));
router
    .route('/profile')
    .get(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        catchAsync(userProfile)
    );
router
    .route('/username')
    .patch(catchAsync(isAuthenticated), catchAsync(changeUsername));
router
    .route('/password')
    .patch(catchAsync(isAuthenticated), catchAsync(changePassword));
router.route('/login').post(
    catchAsync(getEmail),
    catchAsync(async (req, res, next) => {
        passport.authenticate('local', {
            successReturnToOrRedirect: '/',
            failureRedirect: '/',
            failureMessage: `Couldn't log you in 😭.`
        })(req, res, next);
    })
);
router.route('/register').post(catchAsync(registerUser));
router
    .route('/logout')
    .post(catchAsync(isAuthenticated), catchAsync(logoutUser));

router
    .route('/oauth/finalize')
    .get(
        catchAsync(isAuthenticated),
        catchAsync(isNotVerified),
        catchAsync(finalizeUser)
    )
    .post(
        catchAsync(isAuthenticated),
        catchAsync(isNotVerified),
        catchAsync(registerOAuthUser)
    );
module.exports = router;
