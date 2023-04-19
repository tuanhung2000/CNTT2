require("dotenv").config();
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const order = require("../models/order");
const vehicle = require("../models/vehicle");
const order = require("../models/order");

const authorization = req.headers["authorization"].split(" ")[1];
const decodedToken = jwt.verify(authorization, process.env.JWT_ACCESS_TOKEN);

const getUserDetails = async (req, res) => {
  try {
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
  }
};

const editUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber, userID } = req.body;
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
          _id: userID,
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
    throw new Error("Internal Server Error", 500);
  }
};

const getHistoryList = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
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
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
  }
};

const cancleTrip = async (req, res) => {
  try {
    const vehicleID = req.body.vehicleID;
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
  }
};

//Admin
const getAllUsers = async (req, res) => {
  try {
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const username = decodedToken.UserInfo.username;

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
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
    throw new Error("Internal Server Error", 500);
  }
};

const getAllOrder = async (req, res) => {
  try {
  } catch (error) {
    throw new Error("Internal Server Error", 500);
  }
};

//Driver
const responseOrder = async(req, res) => {
    
}

module.exports = {
  getUserDetails,
  editUserInfo,
  getHistoryList,
  bookTrip,
  cancleTrip,

  getAllUsers,
  deleteUser,
};
