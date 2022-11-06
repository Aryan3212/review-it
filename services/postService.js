const { PostModel } = require('../models/postModel');
const { sanitizeUserInput, objectMap } = require('../utils');

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
    const newPostObj = {
        title,
        price,
        description,
        longitude,
        latitude,
        name,
        images,
        author
    };
    const sanitizedNewPost = objectMap(
        newPostObj,
        (value) =>
            value && typeof value === 'string' && sanitizeUserInput(value)
    );
    const newPost = new PostModel(sanitizedNewPost);
    newPost.location = {
        geometry: {
            coordinates: [longitude, latitude]
        },
        properties: {
            name
        }
    };
    newPost.author = author;
    newPost.images = images;
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
    const toBeUpdatedPost = await getSinglePostService(id);
    toBeUpdatedPost.title = title
        ? sanitizeUserInput(title)
        : toBeUpdatedPost.title;
    toBeUpdatedPost.price = price
        ? sanitizeUserInput(price)
        : toBeUpdatedPost.price;
    toBeUpdatedPost.description = description
        ? sanitizeUserInput(description)
        : toBeUpdatedPost.description;
    toBeUpdatedPost.location.geometry.coordinates[0] =
        longitude || toBeUpdatedPost.location.geometry.coordinates[0];
    toBeUpdatedPost.location.geometry.coordinates[1] =
        latitude || toBeUpdatedPost.location.geometry.coordinates[1];
    toBeUpdatedPost.location.properties.name = name
        ? sanitizeUserInput(name)
        : toBeUpdatedPost.location.properties.name;
    toBeUpdatedPost.images =
        images.length > 1 ? images : toBeUpdatedPost.images;
    const updatedPost = await toBeUpdatedPost.save();
    return updatedPost;
};

const deletePostService = async ({ id }) => {
    return await PostModel.findByIdAndDelete(id);
};

const getPostsService = async ({ query = {}, populateFields = [] }) => {
    return await PostModel.find(query).populate(populateFields);
};

const getSinglePostService = async (id, populateFields = []) => {
    return await PostModel.findById(id).populate(populateFields);
};

module.exports = {
    filterGeolocationDataService,
    getPostsService,
    getSinglePostService,
    createPostService,
    deletePostService,
    updatePostService
};
