const { Router } = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { catchAsync } = require('../utils');

const router = new Router();

router.route('/').patch(catchAsync(updateUser)).delete(catchAsync(deleteUser));

router.route('/login').post(catchAsync(loginUser));
router.route('/register').post(catchAsync(registerUser));
router.route('/logout').post(catchAsync(logoutUser));

module.exports = router;
