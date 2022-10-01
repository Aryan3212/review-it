const { Router } = require('express');
const postRoutes = require('./postRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');
const googleAuthRoutes = require('./auth/google/google');

const router = new Router();

router.all('/', (req, res) => {
  res.redirect('/posts');
});
router.use('/posts/:post_id/reviews', reviewRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/auth/google', googleAuthRoutes);

router.all('*', (req, res) => {
  res.render('lost');
});
module.exports = router;
