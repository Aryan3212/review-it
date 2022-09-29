const mongoose = require('mongoose');

const { Schema } = mongoose;
// Validator functions

const coordinatesArrayValidator = (a) => a.length == 2;

// Schema definitions
const ImageSchema = new Schema({
  url: {
    type: String,
    minLength: 1,
    required: true,
    default: process.env.DEFAULT_IMG
  },
  filename: {
    type: String,
    minLength: 1,
    required: true
  }
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
    type: {
      type: String,
      enum: ['Feature'],
      default: 'Feature',
      required: true
    },
    geometry: {
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: {
        type: [Number],
        validate: {
          validator: coordinatesArrayValidator
        },
        required: true
      }
    },
    properties: {
      name: {
        type: String,
        minLength: 1,
        maxLength: 300,
        required: true
      }
    }
  },
  { _id: false }
);

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
      minLength: 1,
      maxLength: 300
    },
    price: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      minLength: 1,
      maxLength: 1500
    },
    location: LocationSchema,
    images: [ImageSchema],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  opts
);

module.exports.CampgroundModel =
  mongoose.model.Campground || mongoose.model('Campground', CampgroundSchema);
