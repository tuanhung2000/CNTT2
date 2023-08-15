require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const DBconnection = require("./config/dbConn");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 9090;

const app = express();
DBconnection();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const vehicleRoutes = require("./routes/vehicle");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/review");

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use('/order', orderRoutes)

app.use("/vehicle", vehicleRoutes);

app.use("/review", reviewRoutes);

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
