const mongoose = require('mongoose');

const { Schema } = mongoose;

// Validator functions

const coordinatesArrayValidator = (a) => a.length == 2;

// Schema definitions
const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const LocationSchema = new Schema(
  {
    type: { type: String, enum: ['Feature'], default: 'Feature' },
    geometry: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        type: [Number],
        validate: {
          validator: coordinatesArrayValidator
        }
      }
    },
    properties: {
      name: String
    }
  },
  { _id: false }
);

const CampgroundSchema = new Schema({
  title: String,
  price: {
    type: Number,
    min: 0
  },
  description: String,
  location: LocationSchema,
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
});

module.exports.CampgroundModel = mongoose.model('Campground', CampgroundSchema);
