const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  rate: {
    type: String,
    default: "0.0",
  },
});

module.exports = mongoose.model("User", UserSchema);
