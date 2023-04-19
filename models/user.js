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
    default: "client",
  },
  createdDate: {
    type: Date,
  },
});

module.exports = mongoose.model("User", UserSchema);
