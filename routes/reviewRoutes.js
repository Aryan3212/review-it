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
const { isVerified } = require('../middleware/userVerifiedMiddleware');
const { limitReviews } = require('../middleware/limitItems');
const { catchAsync } = require('../utils');

const router = new Router({ mergeParams: true });

router
    .route('/:id')
    .patch(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        catchAsync(isReviewAuthor),
        catchAsync(updateReview)
    )
    .delete(
        catchAsync(isAuthenticated),
        catchAsync(isReviewAuthor),
        catchAsync(deleteReview)
    );

router
    .route('/')
    .post(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        catchAsync(limitReviews),
        catchAsync(createReview)
    );

module.exports = router;
