const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const { catchAsync } = require('../utils');
const passport = require('passport');
const router = new Router();

router.route('/').patch(catchAsync(updateUser)).delete(catchAsync(deleteUser));

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
router.route('/logout').post(catchAsync(logoutUser));

module.exports = router;
