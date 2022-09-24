const { Router } = require('express');
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
const { catchAsync } = require('../utils');

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
  .post(catchAsync(isAuthenticated), catchAsync(createCampground));

module.exports = router;
