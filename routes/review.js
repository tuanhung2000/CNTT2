const express = require("express");
const router = express.Router();
const {
    getReviews,
    postReview,
    editReview,
    deleteReview,
} = require("../controllers/review");

router.get("/:contentID", getReviews);

router.post("/", postReview);

router.patch("/", editReview);

router.delete("/", deleteReview);

module.exports = router;