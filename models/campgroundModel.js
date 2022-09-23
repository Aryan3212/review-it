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

const CampgroundSchema = new Schema(
  {
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
  },
  opts
);

module.exports.CampgroundModel =
  mongoose.model.Campground || mongoose.model('Campground', CampgroundSchema);
