require("dotenv").config();
const mongoose = require("mongoose");

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = DBconnection;
