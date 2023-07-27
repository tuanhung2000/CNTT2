const mongoose = require("mongoose");

const MakesSchema = new mongoose.Schema({
  ID: {
    type: Number,
  },
  make: {
    type: String,
  },
});

module.exports = mongoose.model("Makes", MakesSchema);
