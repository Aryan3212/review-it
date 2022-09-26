const { CampgroundModel } = require('../models/campgroundModel');
const { ReviewModel } = require('../models/ReviewModel');

const listCampgrounds = async (req, res) => {
  const campgrounds = await CampgroundModel.find({});
  const user = req.user;
  res.status(200).render('campgrounds/list', {
    title: 'Campgrounds',
    campgrounds,
    currentUser: user
  });
};

const showCampground = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const campground = await CampgroundModel.findById(id).populate('author');
  const reviews = await ReviewModel.find({
    campground: campground.id
  }).populate('author');
  res.status(200).render('campgrounds/show', {
    title: campground.title,
    campground,
    reviews,
    currentUser: user
  });
};

const createCampground = async (req, res) => {
  const { title, price, description, longitude, latitude, name } = req.body;
  const author = req.user;
  const images = req.files.map((file) => {
    return {
      url: file.path,
      filename: file.filename
    };
  });
  const newCamp = new CampgroundModel({
    title,
    price,
    description,
    location: {
      geometry: {
        coordinates: [longitude, latitude]
      },
      properties: {
        name: name || ''
      }
    },
    author,
    images
  });
  await newCamp.save();
  res.redirect(`/campgrounds/`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletingCamp = await CampgroundModel.deleteOne({ _id: id });
  res.redirect('/campgrounds');
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedCamp = await CampgroundModel.findById(id);
  // return if camp doesn't exist
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
  res.status(204).redirect(`/campgrounds/${toBeUpdatedCamp.id}`);
};
module.exports = {
  listCampgrounds,
  showCampground,
  createCampground,
  updateCampground,
  deleteCampground
};
