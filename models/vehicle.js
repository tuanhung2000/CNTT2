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
    default: "0.0",
  },
  isSelfDrive: {
    type: Boolean,
  },
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  year: {
    type: String,
  },
  feature: {
    type: [Object],
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  address: {
    type: [String],
  },
  rent: {
    type: Boolean,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  isHandled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
