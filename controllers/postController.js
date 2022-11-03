const {
    filterGeolocationDataService,
    allPostsService,
    singlePostService,
    createPostService,
    deletePostService,
    postReviewsService,
    updatePostService
} = require('../services/postService');
const { processUploadedImageFiles } = require('../utils');

const listPosts = async (req, res) => {
    const user = req.user;
    const posts = await allPostsService(['author']);
    const geoData = filterGeolocationDataService(posts);
    res.status(200).render('posts/list', {
        title: 'Posts',
        posts,
        currentUser: user,
        geoData,
        mapTilerApiKey: process.env.MAPTILER_API_KEY
    });
};

const showPost = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const post = await singlePostService(id, ['author']);
    const geoData = filterGeolocationDataService(post);
    const reviews = await postReviewsService(id);
    res.status(200).render('posts/show', {
        title: post.title,
        post,
        reviews,
        currentUser: user,
        geoData,
        mapTilerApiKey: process.env.MAPTILER_API_KEY
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
    res.redirect(`/posts/${newPost.id}`);
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    await deletePostService({ id });
    res.redirect('/posts');
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
    res.status(204).redirect(`/posts/${updatedPost.id}`);
};
module.exports = {
    listPosts,
    showPost,
    createPost,
    updatePost,
    deletePost
};
