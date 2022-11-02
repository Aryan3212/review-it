const {
    createReviewService,
    deleteReviewService,
    updateReviewService
} = require('../services/reviewService');

const createReview = async (req, res) => {
    const { details, rating } = req.body;
    const { post_id: post } = req.params;
    const author = req.user.id;
    const createdReview = await createReviewService({
        details,
        rating,
        author,
        post
    });
    return res.redirect(`/posts/${createdReview.post}`);
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    const deletingPost = await deleteReviewService(id);
    return res.redirect(`/posts/${deletingPost.post}`);
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { details, rating } = req.body;
    const updatedReview = updateReviewService({ details, rating, id });
    return res.redirect(`/posts/${updatedReview.post}`);
};
module.exports = {
    createReview,
    updateReview,
    deleteReview
};
