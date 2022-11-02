const { Router } = require('express');
const {
  registerUser,
  logoutUser,
  deleteUser,
  updateUser,
  finalizeUser,
  registerOAuthUser
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { catchAsync } = require('../utils');
const passport = require('passport');
const { UserModel } = require('../models/userModel');
const router = new Router();

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

router
  .route('/')
  .patch(catchAsync(isAuthenticated), catchAsync(updateUser))
  .delete(catchAsync(isAuthenticated), catchAsync(deleteUser));

router.route('/login').post(
  catchAsync(async (req, res, next) => {
    passport.authenticate('local', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/',
      failureMessage: true
    })(req, res, next);
  })
);
router.route('/register').post(catchAsync(registerUser));
router
  .route('/logout')
  .post(catchAsync(isAuthenticated), catchAsync(logoutUser));

router
  .route('/oauth/finalize')
  .get(catchAsync(isAuthenticated), catchAsync(finalizeUser))
  .post(catchAsync(registerOAuthUser));
module.exports = router;
