const { ReviewModel } = require('../models/reviewModel');
const { sanitizeUserInput } = require('../utils');

const ObjectId = require('mongodb').ObjectId;
const createReviewService = async ({ details, rating, author, post }) => {
    const newReview = new ReviewModel({
        details: sanitizeUserInput(details),
        rating: rating,
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
    reviewToBeUpdated.details =
        sanitizeUserInput(details) || reviewToBeUpdated.details;
    reviewToBeUpdated.rating = rating || reviewToBeUpdated.rating;
    return await reviewToBeUpdated.save();
};
const getReviewsService = async ({ query = {}, populateFields = [] }) => {
    return await ReviewModel.find(query).populate(populateFields);
};

module.exports = {
    createReviewService,
    deleteReviewService,
    updateReviewService,
    getReviewsService
};
