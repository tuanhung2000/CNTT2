const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  driverID: {
    type: String,
  },
  image: {
    type: [String],
  },
  licensePlate: {
    type: String,
  },
  price: {
    type: String,
  },
  extraFee: {
    type: String,
  },
  rate: {
    type: String,
    default: 0,
  },
  type: {
    type: String,
  },
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  feature: {
    type: [String],
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
