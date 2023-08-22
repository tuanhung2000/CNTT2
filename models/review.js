const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  fullname: {
    type: String,
  },
  type: {
    type: String,
  },
  typeID: {
    type: String,
  },
  userName: {
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
