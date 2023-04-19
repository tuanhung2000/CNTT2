const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  ward: {
    type: String,
  },
  level: {
    type: String,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
