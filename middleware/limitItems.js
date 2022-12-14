const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/reviewModel');

const limitReviews = async (req, res, next) => {
    const currentUser = req.user;
    const { post_id } = req.params;
    const reviews = await ReviewModel.find({
        author: currentUser.id,
        post: post_id
    });
    if (reviews.length > 0) {
        req.flash('error', 'You already wrote a review 😬.');
        return res.redirect(`/posts/${post_id}`);
    }
    return next();
};

const limitPosts = async (req, res, next) => {
    const currentUser = req.user;
    const { id } = req.params;
    const posts = await PostModel.find({ author: currentUser.id, id });
    if (posts.length === 5) {
        req.flash('error', 'You already have 5 posts 😅.');
        return res.redirect(`/`);
    }
    return next();
};

module.exports = {
    limitPosts,
    limitReviews
};
