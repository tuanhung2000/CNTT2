const mongoose = require("mongoose");

const VehicleSpecSchema = new mongoose.Schema({
  driverID: {
    type: String,
  },
  vehicleID: {
    type: String,
  },
  powers: {
    type: String,
  },
  fuelType: {
    type: String,
  },
  insurance: {
    type: String,
  },
  consumption: {
    type: String,
  },
  maxSpeed: {
    type: Number,
  }
});

module.exports = mongoose.model("VehicleSpec", VehicleSpecSchema);
