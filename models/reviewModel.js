const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema definitions

const ReviewSchema = new Schema({
    details: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: "Campground",
    },
});

module.exports.CampgroundModel = mongoose.model("Review", ReviewSchema);
