const mongoose = require("mongoose");

const VehicleListSchema = new mongoose.Schema({
  year: {
    type: String,
  },
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model("VehicleList", VehicleListSchema);
