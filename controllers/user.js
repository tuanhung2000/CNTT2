require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");

const getUserDetails = async (req, res) => {
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

    return res.status(200).send({
      User,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;
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

    if (User.role == "admin") {
      await user.findByIdAndUpdate(
        {
          _id: User._id,
        },
        {
          firstName: firstName,
          lastName: lastName,
          address: address,
          phoneNumber: phoneNumber,
        }
      );
      return res.status(200).send({
        msg: "Update infomation success!!!",
      });
    }

    await user.findByIdAndUpdate(
      {
        _id: User._id,
      },
      {
        firstName: firstName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
      }
    );

    return res.status(200).send({
      msg: "Update infomation success!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getHistoryList = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;
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
    const Order = await order.find({
      userID: User._id,
    });

    return res.status(200).send({
      Order,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const bookTrip = async (req, res) => {
  try {
    const {
      address,
      start,
      end,
      vehicleID,
      serviceType,
      clientRequire,
      total,
    } = req.body;
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    const order = await order.create({
      userID: User._id,
      address: address,
      start: start,
      end: end,
      vehicleID: vehicleID,
      serviceType: serviceType,
      clientRequire: clientRequire,
      total: total,
    });

    return res.status(200).send({
      msg: "Book a trip success!!",
      order,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const cancleTrip = async (req, res) => {
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

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    await vehicle.findOneAndDelete({
      _id: Vehicle._id,
    });

    return res.status(200).send({
      msg: "Cancle success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

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
  getUserDetails,
  editUserInfo,
  getAllUsers,
};
