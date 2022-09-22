const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema definitions

const ReviewSchema = new Schema({
  details: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: 'Campground',
    index: true
  }
});

module.exports.ReviewModel = mongoose.model('Review', ReviewSchema);
