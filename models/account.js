const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
});

module.exports = Account = mongoose.model("Account", AccountSchema);
