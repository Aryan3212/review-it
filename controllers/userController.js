const { UserModel } = require('../models/userModel');
const passport = require('passport');
const loginUser = async (req, res) => {};

const logoutUser = async (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new UserModel({ username, email });
  await UserModel.register(newUser, password, () => {
    const authenticate = UserModel.authenticate();
    authenticate(newUser.username, password, function (err, result) {
      if (err) {
        next(err);
      }
      req.login(result, (err) => {
        if (err) {
          next(err);
        }
        res.redirect('/');
      });
    });
  });
};

const deleteUser = async (req, res) => {};

const updateUser = async (req, res) => {};
module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  deleteUser
};
