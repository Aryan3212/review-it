const { Router } = require("express");
const {
    showCampground,
    listCampgrounds,
    createCampground,
    updateCampground,
    deleteCampground,
} = require("../controllers/campgroundController");
const { catchAsync } = require("../utils");

const router = new Router();

router
    .route("/:id")
    .get(catchAsync(showCampground))
    .put(catchAsync(updateCampground))
    .delete(catchAsync(deleteCampground));

router
    .route("/")
    .get(catchAsync(listCampgrounds))
    .post(catchAsync(createCampground));

module.exports = router;
