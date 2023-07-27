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
} = require("../controllers/vehicle");

router
  .get("/", getAllVehicle)

  .get("/vehicle_query", queryVehicle)
  .get("/:vehicleID", getVehicle)

  .post("/", createVehicle)
  .post("/vehicle_list", createVehicleList)

  .patch("/:vehicleID", editVehicle)
  .delete("/:vehicleID", deleteVehicle);
module.exports = router;
