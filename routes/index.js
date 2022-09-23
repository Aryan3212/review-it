const { Router } = require('express');
const campgroundRoutes = require('./campgroundRoutes');
const reviewRoutes = require('./reviewRoutes');
const userRoutes = require('./userRoutes');

const router = new Router({ mergeParams: true });

router.all('/', (req, res) => {
  res.redirect('/campgrounds');
});
router.use('/campgrounds', campgroundRoutes);
router.use('/campgrounds/:campground_id/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.all('*', (req, res) => {
  res.render('lost');
});
module.exports = router;
