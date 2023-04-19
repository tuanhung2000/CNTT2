const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
