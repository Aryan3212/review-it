const {
    filterGeolocationDataService,
    createPostService,
    deletePostService,
    getSinglePostService,
    updatePostService,
    getPostsService
} = require('../services/postService');
const { getReviewsService } = require('../services/reviewService');

const { processUploadedImageFiles } = require('../utils');

const listPosts = async (req, res) => {
    const user = req.user;
    const posts = await getPostsService({ populateFields: ['author'] });
    const geoData = filterGeolocationDataService(posts);
    const successFlash = req.flash('success')[0];
    const errorFlash = req.flash('error')[0];
    return res.status(200).render('posts/list', {
        posts,
        currentUser: user && user.verified ? user : null,
        geoData,
        mapTilerApiKey: process.env.MAPTILER_API_KEY,
        success: successFlash,
        error: errorFlash
    });
};

const showPost = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const post = await getSinglePostService(id, ['author']);
    const geoData = filterGeolocationDataService(post);
    const reviews = await getReviewsService({
        query: { post: id },
        populateFields: ['author']
    });
    const successFlash = req.flash('success')[0];
    const errorFlash = req.flash('error')[0];
    return res.status(200).render('posts/show', {
        title: post.title,
        post,
        reviews,
        currentUser: user && user.verified ? user : null,
        geoData,
        mapTilerApiKey: process.env.MAPTILER_API_KEY,
        success: successFlash,
        error: errorFlash
    });
};

const createPost = async (req, res) => {
    const { title, price, description, longitude, latitude, name } = req.body;
    const author = req.user;
    const images = processUploadedImageFiles(req.files);
    const newPost = await createPostService({
        title,
        price,
        description,
        longitude,
        latitude,
        name,
        images,
        author
    });
    req.flash('success', `${title} created. Users can Review-it 😼!`);
    return res.redirect(`/posts/${newPost.id}`);
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    await deletePostService({ id });
    req.flash('success', `Post deleted 😼!`);
    return res.redirect('/posts');
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, price, description, longitude, latitude, name } = req.body;
    const images = processUploadedImageFiles(req.files);
    const updateFields = {
        id,
        title,
        price,
        description,
        longitude,
        latitude,
        name,
        images
    };
    const updatedPost = await updatePostService(updateFields);
    req.flash('success', `Post updated 😼!`);
    return res.status(204).redirect(`/posts/${updatedPost.id}`);
};
module.exports = {
    listPosts,
    showPost,
    createPost,
    updatePost,
    deletePost
};
