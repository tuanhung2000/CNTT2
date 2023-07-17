require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");

//Admin
const getAllUsers = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (User.role !== "admin") {
      return res.status(401).send({
        msg: "Not Allowed",
      });
    }

    const allUsers = await user.find({});

    return res.status(200).send({
      allUsers,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (User.role !== "admin") {
      return res.status(401).send({
        msg: "Not Allowed",
      });
    }

    await user.findOneAndDelete({
      _id: req.body.userID,
    });

    return res.status(200).send({
      msg: "Delete user success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

//Driver
const responseOrder = async (req, res) => {};

module.exports = {
};
