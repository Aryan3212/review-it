const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Validator functions

const coordinatesArrayValidator = (a) => a.length == 2;

// Schema definitions

const LocationSchema = new Schema(
    {
        type: { type: String, enum: ["Feature"], default: "Feature" },
        geometry: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: {
                type: [Number],
                validate: {
                    validator: coordinatesArrayValidator,
                },
            },
        },
        properties: {
            name: String,
        },
    },
    { _id: false }
);

const CampgroundSchema = new Schema({
    title: String,
    price: {
        type: Number,
        min: 0,
    },
    description: String,
    location: LocationSchema,
    // reviews
    // users
});

module.exports.CampgroundModel = mongoose.model("Campground", CampgroundSchema);
