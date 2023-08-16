const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  editUserInfo,
  getAllUsers,
  getHistoryList,
  // bookTrip,
  // cancleTrip,
  deleteUser,
  recharge
} = require("../controllers/user");

router.get("/details", getUserDetails).patch("/edit-info", editUserInfo);

router.get("/all-users", getAllUsers);

router.get("/history", getHistoryList);

router.delete("/", deleteUser);

router.post("/recharge", recharge)

module.exports = router;
