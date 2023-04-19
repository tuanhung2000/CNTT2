require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/dbConn");
// const corsOptions = require("");
const PORT = process.env.PORT || 9090;

const app = express();
connectDB();

// app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use("*", (req, res) => {
  res.status(404).send({
    success: "false",
    msg: "Page not found",
    error: {
      statusCode: 404,
      msg: "You reached a route that is not defined on this server",
    },
  });
});

mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .on("error", (err) => {
    console.log(err);
  });
