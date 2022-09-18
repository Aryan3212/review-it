const { Router } = require("express");
const campgroundRoutes = require("./campgroundRoutes.js");
const router = new Router();

router.use("/campgrounds", campgroundRoutes);

module.exports = router;
