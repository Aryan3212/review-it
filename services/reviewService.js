const { ReviewModel } = require('../models/ReviewModel');

const createReviewService = async ({ details, rating, author, post }) => {
    const newReview = new ReviewModel({
        details,
        rating,
        author,
        post
    });
    return await newReview.save();
};

const deleteReviewService = async ({ id }) => {
    return await ReviewModel.findByIdAndRemove(id);
};

const updateReviewService = async ({ details, rating, id }) => {
    const reviewToBeUpdated = await ReviewModel.findById(id);
    reviewToBeUpdated.details = details || reviewToBeUpdated.details;
    reviewToBeUpdated.rating = rating || reviewToBeUpdated.rating;
    return await reviewToBeUpdated.save();
};

module.exports = {
    createReviewService,
    deleteReviewService,
    updateReviewService
};
