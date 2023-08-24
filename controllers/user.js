require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");
const wallet = require("../models/wallet");
const { getReviews } = require("../controllers/review");

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

// const bookTrip = async (req, res) => {
//   try {
//     const {
//       address,
//       start,
//       end,
//       vehicleID,
//       serviceType,
//       clientRequire,
//       total,
//     } = req.body;
//     const username = getAccess(req.headers["authorization"]);

//     if (!username) {
//       return res.status(403).send({
//         msg: "Authentication!!!",
//       });
//     }

//     const User = await user.findOne({
//       username: username,
//     });

//     const Vehicle = await vehicle.findOne({
//       _id: vehicleID,
//     });

//     if (!User) {
//       return res.status(401).send({
//         msg: "Not found user",
//       });
//     }

//     if (!Vehicle) {
//       return res.status(401).send({
//         msg: "Not found vehicle",
//       });
//     }

//     const order = await order.create({
//       userID: User._id,
//       address: address,
//       start: start,
//       end: end,
//       vehicleID: vehicleID,
//       serviceType: serviceType,
//       clientRequire: clientRequire,
//       total: total,
//     });

//     return res.status(200).send({
//       msg: "Book a trip success!!",
//       order,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       msg: "Internal Server Error",
//     });
//   }
// };

// const cancleTrip = async (req, res) => {
//   try {
//     const username = getAccess(req.headers["authorization"]);

//     if (!username) {
//       return res.status(403).send({
//         msg: "Authentication!!!",
//       });
//     }

//     const User = await user.findOne({
//       username: username,
//     });

//     const Vehicle = await vehicle.findOne({
//       _id: vehicleID,
//     });

//     if (!User) {
//       return res.status(401).send({
//         msg: "Not found user",
//       });
//     }

//     if (!Vehicle) {
//       return res.status(401).send({
//         msg: "Not found vehicle",
//       });
//     }

//     await vehicle.findOneAndDelete({
//       _id: Vehicle._id,
//     });

//     return res.status(200).send({
//       msg: "Cancle success!!",
//     });
//   } catch (error) {
//     return res.status(500).send({
//       msg: "Internal Server Error",
//     });
//   }
// };

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

const updateWallet = async (req, res) => {
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

    const Wallet = await wallet.find({
      userID: User._id,
    });

    if (!Wallet) {
      return res.status(401).send({
        msg: "Not found wallet",
      });
    }

    await wallet.findOneAndUpdate(
      {
        _id: Wallet._id,
      },
      {
        amount: amount,
      }
    );

    return res.status(200).send({
      msg: "Update wallet succcess!!!",
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
    const { vehicleID } = req.body;
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
        isAccepted: true,
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
  getHistoryList,
  getOWnerDetails,

  // bookTrip,
  // cancleTrip,
  deleteUser,
  recharge,
  responseNewVehicle,
};
