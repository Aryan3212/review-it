const { UserModel } = require('../models/userModel');

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

const deleteUser = async (req, res) => {
  // TODO
};

const updateUser = async (req, res) => {
  // TODO
};
module.exports = {
  registerUser,
  logoutUser,
  updateUser,
  deleteUser
};
