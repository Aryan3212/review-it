const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/reviewModel');
// Backend validator
const isPostAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    if (!post.author.equals(req.user.id)) {
        req.flash('error', "You're not the author 😭");
        return res.redirect(`/posts/${id}`);
    }
    return next();
};

const isReviewAuthor = async (req, res, next) => {
    const { post_id: id, id: reviewId } = req.params;
    const review = await ReviewModel.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', "You're not the author 😭");
        return res.redirect(`/posts/${id}`);
    }
    next();
};

const isAuthenticated = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', "You're not signed in 😭");
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isPostAuthor,
    isReviewAuthor,
    isAuthenticated
};
