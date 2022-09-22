const { ReviewModel } = require('../models/ReviewModel');
const { UserModel } = require('../models/UserModel');
const createReview = async (req, res) => {
  const { details, rating, author, campground } = req.body;
  const newReview = new ReviewModel({
    details,
    rating,
    author,
    campground
  });
  await newReview.save();
  res.redirect(`/campgrounds/${campground}`);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const deletingCamp = await ReviewModel.deleteOne({ _id: id });
  res.redirect(`/campgrounds/${deletingCamp.id}`);
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedCamp = await ReviewModel.findById(id);
  // return if camp doesnt exist
  const { title, price, description, location } = req.body;

  toBeUpdatedCamp.title = title || toBeUpdatedCamp.title;
  toBeUpdatedCamp.price = price || toBeUpdatedCamp.price;
  toBeUpdatedCamp.description = description || toBeUpdatedCamp.description;
  if (location) {
    toBeUpdatedCamp.location.geometry.coordinates =
      location.coordinates || toBeUpdatedCamp.location.geometry.coordinates;
    toBeUpdatedCamp.location.properties.name =
      location.name || toBeUpdatedCamp.location.properties.name;
  }
  await toBeUpdatedCamp.save();
  // Redirect to somewhere useful
  res.redirect(`/campgrounds/${toBeUpdatedCamp.id}`);
};
module.exports = {
  createReview,
  updateReview,
  deleteReview
};
