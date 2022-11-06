const mongoose = require('mongoose');
const { Schema } = mongoose;

const opts = {
    strict: true,
    strictQuery: false,
    timestamps: true,
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
        details: {
            type: String,
            minLength: 1,
            maxLength: 1500
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            index: true,
            required: true
        }
    },
    opts
);

module.exports.ReviewModel =
    mongoose.model.Review || mongoose.model('Review', ReviewSchema);
