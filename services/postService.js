const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/reviewModel');

const filterGeolocationDataService = (posts) => {
    if (!Array.isArray(posts)) {
        posts = [posts];
    }
    return posts.map((post) => {
        const filteredObject = { ...post.location.toObject() };
        filteredObject.properties = {
            name: filteredObject.properties.name,
            title: post.title,
            id: post.id
        };
        return filteredObject;
    });
};

const createPostService = async ({
    title,
    price,
    description,
    longitude,
    latitude,
    name,
    images,
    author
}) => {
    const newPost = new PostModel({
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
    return await newPost.save();
};
const updatePostService = async ({
    id,
    title,
    price,
    description,
    longitude,
    latitude,
    name,
    images
}) => {
    const toBeUpdatedPost = await singlePostService(id);
    toBeUpdatedPost.title = title || toBeUpdatedPost.title;
    toBeUpdatedPost.price = price || toBeUpdatedPost.price;
    toBeUpdatedPost.description = description || toBeUpdatedPost.description;
    toBeUpdatedPost.location.geometry.coordinates[0] =
        longitude || toBeUpdatedPost.location.geometry.coordinates[0];
    toBeUpdatedPost.location.geometry.coordinates[1] =
        latitude || toBeUpdatedPost.location.geometry.coordinates[1];
    toBeUpdatedPost.location.properties.name =
        name || toBeUpdatedPost.location.properties.name;
    toBeUpdatedPost.images =
        images.length > 1 ? images : toBeUpdatedPost.images;
    const updatedPost = await toBeUpdatedPost.save();
    return updatedPost;
};

const deletePostService = async ({ id }) => {
    return await PostModel.findByIdAndDelete(id);
};

const allPostsService = async (populateFields = []) => {
    return await PostModel.find({}).populate(populateFields);
};

const singlePostService = async (id, populateFields = []) => {
    return await PostModel.findById(id).populate(populateFields);
};

const postReviewsService = async (id) => {
    return await ReviewModel.find({
        post: id
    }).populate('author');
};

module.exports = {
    filterGeolocationDataService,
    allPostsService,
    singlePostService,
    postReviewsService,
    createPostService,
    deletePostService,
    updatePostService
};
