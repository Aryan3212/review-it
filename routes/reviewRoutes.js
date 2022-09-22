const { Router } = require('express');
const {
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { catchAsync } = require('../utils');

const router = new Router();

router
  .route('/:id')
  .patch(catchAsync(updateReview))
  .delete(catchAsync(deleteReview));

router.route('/').post(catchAsync(createReview));

module.exports = router;
