const loginUser = async (req, res) => {};

const logoutUser = async (req, res) => {};

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  await User.register(username, password, () => {
    res.redirect('/');
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
