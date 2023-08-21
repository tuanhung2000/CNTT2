const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  editUserInfo,
  getAllUsers,
  getHistoryList,
  getOWnerDetails,
  // bookTrip,
  // cancleTrip,
  deleteUser,
  recharge,
  responseNewVehicle,
} = require("../controllers/user");

router.get("/details", getUserDetails).patch("/edit-info", editUserInfo);

router.get("/all-users", getAllUsers);

router.get("/history", getHistoryList);

router.delete("/", deleteUser);

router.post("/recharge", recharge);

router.get("/owner/:ownerID", getOWnerDetails);

router.patch("/responseVehicle", responseNewVehicle);

module.exports = router;
