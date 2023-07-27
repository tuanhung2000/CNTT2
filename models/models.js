const mongoose = require("mongoose");

const ModelsSchema = new mongoose.Schema({
  model: {
    type: String,
  },
  makeID: {
    type: Number,
  },
});

module.exports = mongoose.model("Models", ModelsSchema);
