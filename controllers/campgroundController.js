const { CampgroundModel } = require("../models/campgroundModel");

const listCampgrounds = async (req, res) => {
    const camps = await CampgroundModel.find({});
    res.status(200).send(camps);
};

const showCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await CampgroundModel.findById(id);
    res.send(camp);
};

const createCampground = async (req, res) => {
    const { title, price, description, location } = req.body;
    const newCamp = new CampgroundModel({
        title: title,
        price: price,
        description: description,
        location: {
            geometry: {
                coordinates: location.geometry.coordinates,
            },
            properties: {
                name: location.properties.name || "",
            },
        },
    });
    await newCamp.save();
    res.status(203).redirect(`/campgrounds/${newCamp.id}`);
};

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletingCamp = await CampgroundModel.deleteOne({ _id: id });
    // Redirect to somewhere useful
    res.status(204).redirect(`/campgrounds/`);
};
const updateCampground = async (req, res) => {
    const { id } = req.params;
    const toBeUpdatedCamp = await CampgroundModel.findById(id);
    // return if camp doesnt exist
    const { title, price, description, location } = req.body;

    toBeUpdatedCamp.title = title || toBeUpdatedCamp.title;
    toBeUpdatedCamp.price = price || toBeUpdatedCamp.price;
    toBeUpdatedCamp.description = description || toBeUpdatedCamp.description;
    if (location) {
        toBeUpdatedCamp.location.geometry.coordinates =
            location.coordinates ||
            toBeUpdatedCamp.location.geometry.coordinates;
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
    deleteCampground,
};
