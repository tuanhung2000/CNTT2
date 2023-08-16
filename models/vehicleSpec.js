const mongoose = require("mongoose");

const VehicleSpecSchema = new mongoose.Schema({
  driverID: {
    type: String,
  },
  vehicleID: {
    type: String,
  },
  type: {
    type: String
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
    type: Number,
  },
  maxSpeed: {
    type: Number,
  },
  numberConstructor: {
    type: String
  }
});

module.exports = mongoose.model("VehicleSpec", VehicleSpecSchema);
