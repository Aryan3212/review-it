const { Router } = require('express');
const {
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const {
  isReviewAuthor,
  isAuthenticated
} = require('../middleware/authMiddleware');
const { catchAsync } = require('../utils');

const router = new Router({ mergeParams: true });

router
  .route('/:id')
  .patch(
    catchAsync(isAuthenticated),
    catchAsync(isReviewAuthor),
    catchAsync(updateReview)
  )
  .delete(
    catchAsync(isAuthenticated),
    catchAsync(isReviewAuthor),
    catchAsync(deleteReview)
  );

router.route('/').post(catchAsync(isAuthenticated), catchAsync(createReview));

module.exports = router;
