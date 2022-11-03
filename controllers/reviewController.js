const {
    createReviewService,
    deleteReviewService,
    updateReviewService
} = require('../services/reviewService');

const createReview = async (req, res) => {
    const { details, rating } = req.body;
    const { post_id: post } = req.params;
    const author = req.user.id;
    await createReviewService({
        details,
        rating,
        author,
        post
    });
    return res.redirect(`/posts/${post}`);
};

const deleteReview = async (req, res) => {
    const { id, post_id } = req.params;
    await deleteReviewService(id);
    return res.redirect(`/posts/${post_id}`);
};

const updateReview = async (req, res) => {
    const { id, post_id } = req.params;
    const { details, rating } = req.body;
    await updateReviewService({ details, rating, id });
    return res.redirect(`/posts/${post_id}`);
};
module.exports = {
    createReview,
    updateReview,
    deleteReview
};
