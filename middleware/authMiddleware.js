const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/ReviewModel');
// Backend validator
const isPostAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await PostModel.findById(id);
  if (!post.author.equals(req.user.id)) {
    return res.redirect(`/posts/${id}`);
  }
  return next();
};

const isReviewAuthor = async (req, res, next) => {
  const { post_id: id, id: reviewId } = req.params;
  const review = await ReviewModel.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    return res.redirect(`/posts/${id}`);
  }
  next();
};

const isAuthenticated = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    // req.session.returnTo = req.originalUrl;
    // req.flash('error', 'You must be signed in first!');
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isPostAuthor,
  isReviewAuthor,
  isAuthenticated
};
