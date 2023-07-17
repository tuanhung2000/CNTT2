const express = require("express");
const router = express.Router();
const {
  getAllVehicle,
  getVehicle,
  createVehicle,
  editVehicle,
  deleteVehicle,
  createVehicleList,
} = require("../controllers/vehicle");

router
  .get("/:vehicleID", getVehicle)
  .get("/", getAllVehicle)
  .post("/", createVehicle)
  .patch("/:vehicleID", editVehicle)
  .delete("/:vehicleID", deleteVehicle)

  .post("/vehicle_list", createVehicleList);

module.exports = router;
