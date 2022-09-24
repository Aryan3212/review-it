const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { catchAsync } = require('../utils');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { UserModel } = require('../models/userModel');
const router = new Router();

passport.use(new LocalStrategy(UserModel.authenticate()));

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

module.exports = router;
