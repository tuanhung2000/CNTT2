const mongoose = require("mongoose");

const VehicleSpecSchema = new mongoose.Schema({
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
  },
  seatNumbers: {
    type: Number
  }
});

module.exports = mongoose.model("VehicleSpec", VehicleSpecSchema);
