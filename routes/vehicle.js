const express = require("express");
const router = express.Router();
const {
  createVehicle,
  editVehicle,
  deleteVehicle,
} = require("../controllers/vehicle");

router.get("/vehicle", createVehicle);

router.patch("/vehicle", editVehicle);

router.delete("/vehicle", deleteVehicle);

module.exports = router;
