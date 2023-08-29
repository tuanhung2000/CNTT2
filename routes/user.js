const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  editUserInfo,
  getAllUsers,
  getOWnerDetails,
  deleteUser,
  recharge,
  responseNewVehicle,
  getNewVehicles,
} = require("../controllers/user");

router.get("/details", getUserDetails).patch("/edit-info", editUserInfo);

router.get("/all-users", getAllUsers);

router.delete("/", deleteUser);

router.post("/recharge", recharge);

router.get("/owner/:ownerID", getOWnerDetails);

router.get("/getNewVehicles", getNewVehicles);

router.patch("/responseVehicle", responseNewVehicle);

module.exports = router;
