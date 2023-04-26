const express = require("express");
const router = express.Router();
const {
  getAllVehicle,
  getVehicle,
  createVehicle,
  editVehicle,
  deleteVehicle,
} = require("../controllers/vehicle");

router
  .get("/:vehicleID", getVehicle)
  .get("/", getAllVehicle)
  .post("/", createVehicle)
  .patch("/:vehicleID", editVehicle)
  .delete("/:vehicleID", deleteVehicle);

module.exports = router;
