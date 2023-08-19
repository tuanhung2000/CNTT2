const express = require("express");
const router = express.Router();
const {
  getAllVehicle,
  getVehicle,
  createVehicle,
  editVehicle,
  deleteVehicle,
  createVehicleList,
  queryVehicle,
  getOwnVehicle
} = require("../controllers/vehicle");

router
  .get("/", getAllVehicle)

  .get("/owned", getOwnVehicle)

  .get("/vehicle_query", queryVehicle)
  .get("/:vehicleID", getVehicle)

  .post("/", createVehicle)
  .post("/vehicle_list", createVehicleList)

  .patch("/:vehicleID", editVehicle)
  .delete("/:vehicleID", deleteVehicle);

module.exports = router;
