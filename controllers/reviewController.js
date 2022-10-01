const { ReviewModel } = require('../models/ReviewModel');

const createReview = async (req, res) => {
  const { details, rating } = req.body;
  const { post_id: post } = req.params;
  const author = req.user.id;
  const newReview = new ReviewModel({
    details,
    rating,
    author,
    post
  });
  await newReview.save();
  res.redirect(`/posts/${post}`);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const deletingCamp = await ReviewModel.findByIdAndRemove(id);
  console.log(deletingCamp);
  res.redirect(`/posts/${deletingCamp.post}`);
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
  res.redirect(`/posts/${toBeUpdatedReview.post}`);
};
module.exports = {
  createReview,
  updateReview,
  deleteReview
};
