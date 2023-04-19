const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  type: {
    type: String,
  },
  rate: {
    type: String,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
