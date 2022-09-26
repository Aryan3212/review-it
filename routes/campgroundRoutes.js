const { Router } = require('express');
const multer = require('multer');
const {
  showCampground,
  listCampgrounds,
  createCampground,
  updateCampground,
  deleteCampground
} = require('../controllers/campgroundController');
const {
  isCampgroundAuthor,
  isAuthenticated
} = require('../middleware/authMiddleware');
const { catchAsync, imageFilter } = require('../utils');

const { storage } = require('../models/cloudinary');
const upload = multer({
  storage,
  limits: {
    fields: 20,
    fileSize: 1024 * 1024 * 25,
    files: 5,
    parts: 10
  },
  fileFilter: imageFilter
});

const router = new Router();

router
  .route('/:id')
  .get(catchAsync(showCampground))
  .patch(
    catchAsync(isAuthenticated),
    catchAsync(isCampgroundAuthor),
    catchAsync(updateCampground)
  )
  .delete(
    catchAsync(isAuthenticated),
    catchAsync(isCampgroundAuthor),
    catchAsync(deleteCampground)
  );

router
  .route('/')
  .get(catchAsync(listCampgrounds))
  .post(
    catchAsync(isAuthenticated),
    upload.array('images'),
    catchAsync(createCampground)
  );

module.exports = router;
