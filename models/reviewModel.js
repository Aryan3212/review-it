const mongoose = require('mongoose');
const { UserModel } = require('./userModel');
const { Schema } = mongoose;

const opts = {
  toJSON: { virtuals: true },
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};
// Schema definitions

const ReviewSchema = new Schema(
  {
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
  },
  opts
);

module.exports.ReviewModel =
  mongoose.model.Review || mongoose.model('Review', ReviewSchema);
