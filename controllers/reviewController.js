const { ReviewModel } = require('../models/ReviewModel');

const createReview = async (req, res) => {
  const { details, rating } = req.body;
  const { campground_id: campground } = req.params;
  const author = req.user.id;
  const newReview = new ReviewModel({
    details,
    rating,
    author,
    campground
  });
  console.log('ars', campground);
  await newReview.save();
  res.redirect(`/campgrounds/${campground}`);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const deletingCamp = await ReviewModel.findByIdAndRemove(id);
  console.log(deletingCamp);
  res.redirect(`/campgrounds/${deletingCamp.campground}`);
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedReview = await ReviewModel.findById(id);
  // return if camp doesnt exist
  const { details, rating } = req.body;

  toBeUpdatedReview.details = details || toBeUpdatedCamp.details;
  toBeUpdatedReview.rating = rating || toBeUpdatedCamp.rating;

  await toBeUpdatedReview.save();
  // Redirect to somewhere useful
  res.redirect(`/campgrounds/${toBeUpdatedReview.campground}`);
};
module.exports = {
  createReview,
  updateReview,
  deleteReview
};
