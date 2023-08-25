const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  address: {
    type: String,
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  vehicleID: {
    type: String,
  },
  serviceType: {
    type: String,
  },
  clientRequire: {
    type: String,
  },
  total: {
    type: Number,
  },
  totalTime: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isResponse: {
    type: String,
    default: false,
  },
  isHandle: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
