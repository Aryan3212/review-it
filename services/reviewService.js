const { ReviewModel } = require('../models/reviewModel');
const ObjectId = require('mongodb').ObjectId;
const createReviewService = async ({ details, rating, author, post }) => {
    const newReview = new ReviewModel({
        details: details.trim(),
        rating,
        author: ObjectId(author),
        post: ObjectId(post)
    });
    return await newReview.save();
};

const deleteReviewService = async ({ id }) => {
    return await ReviewModel.findByIdAndDelete(id);
};

const updateReviewService = async ({ details, rating, id }) => {
    const reviewToBeUpdated = await ReviewModel.findById(id);
    reviewToBeUpdated.details = details.trim() || reviewToBeUpdated.details;
    reviewToBeUpdated.rating = rating || reviewToBeUpdated.rating;
    return await reviewToBeUpdated.save();
};

module.exports = {
    createReviewService,
    deleteReviewService,
    updateReviewService
};
