const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  address: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
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
});

module.exports = mongoose.model("Order", OrderSchema);
