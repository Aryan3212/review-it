const { Router } = require('express');
const campgroundRoutes = require('./campgroundRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');
const googleAuthRoutes = require('./auth/google/google');

const router = new Router();

router.all('/', (req, res) => {
  res.redirect('/campgrounds');
});
router.use('/campgrounds/:campground_id/reviews', reviewRoutes);
router.use('/campgrounds', campgroundRoutes);
router.use('/users', userRoutes);
router.use('/auth/google', googleAuthRoutes);

router.all('*', (req, res) => {
  res.render('lost');
});
module.exports = router;
