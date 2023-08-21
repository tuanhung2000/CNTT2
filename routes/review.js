const express = require("express");
const router = express.Router();
const {
  postReview,
  editReview,
  deleteReview,
} = require("../controllers/review");

router.post("/", postReview);

router.patch("/", editReview);

router.delete("/", deleteReview);

module.exports = router;
