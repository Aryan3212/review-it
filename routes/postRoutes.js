const { Router } = require('express');
const multer = require('multer');
const {
    showPost,
    listPosts,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const {
    isPostAuthor,
    isAuthenticated
} = require('../middleware/authMiddleware');
const { catchAsync, imageFilter } = require('../utils');

const { storage } = require('../models/cloudinary');
const { limitPosts } = require('../middleware/limitItems');
const { isVerified } = require('../middleware/userVerifiedMiddleware');
const upload = multer({
    storage,
    limits: {
        fields: 20,
        fileSize: 1024 * 1024 * 25,
        files: 5,
        parts: 10
    },
    fileFilter: imageFilter
});

const router = new Router();

router
    .route('/:id')
    .get(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        catchAsync(showPost)
    )
    .patch(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        upload.array('images'),
        catchAsync(isPostAuthor),
        catchAsync(updatePost)
    )
    .delete(
        catchAsync(isAuthenticated),
        catchAsync(isPostAuthor),
        catchAsync(deletePost)
    );

router
    .route('/')
    .get(catchAsync(listPosts))
    .post(
        catchAsync(isAuthenticated),
        catchAsync(isVerified),
        catchAsync(limitPosts),
        upload.array('images'),
        catchAsync(createPost)
    );

module.exports = router;
