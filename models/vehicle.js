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
  },
  type: {
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
