const { CampgroundModel } = require('../models/campgroundModel');
const { ReviewModel } = require('../models/ReviewModel');
// Backend validator
const isCampgroundAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampgroundModel.findById(id);
  if (!campground.author.equals(req.user.id)) {
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

const isReviewAuthor = async (req, res, next) => {
  const { campground_id: id, id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    return res.redirect(`/campgrounds/${id}`);
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
  isCampgroundAuthor,
  isReviewAuthor,
  isAuthenticated
};
