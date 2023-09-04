require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const account = require("../models/account");
const vehicle = require("../models/vehicle");
const vehicleSpec = require("../models/vehicleSpec");
const order = require("../models/order");
const wallet = require("../models/wallet");
const { getReviews } = require("../controllers/review");
const review = require("../models/review");

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

    const Wallet = await wallet.findOne({
      userID: User.id,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    return res.status(200).send({
      User,
      Wallet,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getOWnerDetails = async (req, res) => {
  try {
    const ownerID = req.params.ownerID;

    const owner = await user.findOne({
      _id: ownerID,
    });

    if (!owner) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    const reviews = await getReviews(ownerID);

    return res.status(200).send({
      info: owner,
      reviews: reviews,
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber, userID } = req.body;
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
      if (userID) {
        await user.findOneAndUpdate(
          { _id: userID },
          {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phoneNumber: phoneNumber,
          }
        );
        return res.status(200).send({
          msg: "Update user infomation success!!!",
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

const getNewVehicles = async (req, res) => {
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

    if (!User || User.role != "admin") {
      return res.status(401).send({
        msg: "Not found user || not allowed",
      });
    }

    return res.status(200).send({
      vehicles: await vehicle.find({
        isHandled: false,
      }),
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

    const dltUser = await user.findOneAndDelete({
      _id: req.body.userID,
    });

    await account.findOneAndDelete({
      username: dltUser.username,
    });

    await wallet.findOneAndDelete({
      userID: dltUser.id,
    });

    if (dltUser.role == "owner") {
      const dltVehicle = await vehicle.findOneAndDelete({
        driverID: dltUser.id,
      });

      if (dltVehicle) {
        await vehicleSpec.findOneAndDelete({
          vehicleID: dltVehicle.id,
        });
      }
    }

    return res.status(200).send({
      msg: "Delete user success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const recharge = async (req, res) => {
  try {
    const { amount } = req.body;
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

    const Wallet = await wallet.findOne({
      userID: User.id,
    });

    if (!Wallet) {
      await wallet.create({
        userID: User.id,
        amount: amount,
      });

      return res.status(200).send({
        msg: "Recharge succcess!!!",
      });
    }

    await wallet.findOneAndUpdate(
      {
        userID: User.id,
      },
      {
        amount: Wallet.amount + amount,
      }
    );

    return res.status(200).send({
      msg: "Recharge succcess!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

//Admin
const responseNewVehicle = async (req, res) => {
  try {
    const { vehicleID, isAccepted } = req.body;
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    if (!User || User.role !== "admin") {
      return res.status(401).send({
        msg: "Not found user or not allowed",
      });
    }

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
      isHandled: false,
    });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }
    
    await vehicle.findByIdAndUpdate(
      {
        _id: vehicleID,
      },
      {
        isAccepted: isAccepted,
        isHandled: true,
      }
    );

    return res.status(200).send({
      msg: "Vehicle added!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getUserDetails,
  editUserInfo,
  getAllUsers,
  getOWnerDetails,
  deleteUser,
  recharge,
  responseNewVehicle,
  getNewVehicles,
};
