module.exports.catchAsync = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

module.exports.imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
