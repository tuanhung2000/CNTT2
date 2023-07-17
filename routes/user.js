const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  editUserInfo,
  getAllUsers,
} = require("../controllers/user");

router.get("/details", getUserDetails).patch("/edit-info", editUserInfo);

router.get("/all-users", getAllUsers);

module.exports = router;
