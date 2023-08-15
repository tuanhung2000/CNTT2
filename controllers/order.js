require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");

const getAllOrder = async (req, res) => {
  try {
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
        msg: "No Permission",
      });
    }

    return res.status(200).send({
      orders: await order.find({}),
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const requestOrder = async (req, res) => {
  try {
    console.log('?')
    const {
      vehicleID,
      from,
      to,
      totalTime,
      total,
      address,
      serviceType,
      clientRequire,
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

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
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

    // if (Vehicle.isAvailable === false) {
    //   return res.status(401).send({
    //     msg: "Not available",
    //   });
    // }

    await order.create({
      vehicleID: vehicleID,
      userID: User._id,
      from: from,
      to: to,
      totalTime: totalTime,
      total: total,
      address: address,
      serviceType: serviceType,
      clientRequire: clientRequire,
    });

    return res.status(200).send({
      msg: "Success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editOrder = async (req, res) => {
  try {
    const {
      vehicleID,
      from,
      to,
      totalTime,
      total,
      address,
      serviceType,
      clientRequire,
      orderID,
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

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
    });

    const Order = await order.findOne({
      _id: orderID,
      userID: User._id,
    });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
      });
    }

    // if (Vehicle.isAvailable === true) {
    //   return res.status(401).send({
    //     msg: "Cannot edit",
    //   });
    // }

    await order.findByIdAndUpdate(
      {
        _id: orderID,
      },
      {
        from: from,
        to: to,
        totalTime: totalTime,
        total: total,
        address: address,
        serviceType: serviceType,
        clientRequire: clientRequire,
      }
    );

    return res.status(200).send({
      msg: "Success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { vehicleID, orderID } = req.body;
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

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
    });

    const Order = await order.findOne({
      _id: orderID,
      userID: User._id,
    });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
      });
    }

    if (Vehicle.isAvailable === true && Vehicle.isCompleted === false) {
      return res.status(401).send({
        msg: "Cannot delete",
      });
    }

    await order.findByIdAndDelete({
      _id: orderID,
    });

    return res.status(200).send({
      msg: "Success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const responseOrder = async (req, res) => {
  try {
    const { vehicleID, orderID, isAvailable, isCompleted } = req.body;
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

    const Vehicle = await vehicle.findOne({
      _id: vehicleID,
    });

    const Order = await order.findOne({
      _id: orderID,
      userID: User._id,
    });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
      });
    }

    if (Vehicle.isAvailable === true && Vehicle.isCompleted === true) {
      return res.status(401).send({
        msg: "Cannot response",
      });
    }

    if (isCompleted) {
      await order.findByIdAndUpdate(
        {
          _id: orderID,
        },
        {
          isCompleted: isCompleted,
        }
      );
    }

    await order.findByIdAndUpdate(
      {
        _id: orderID,
      },
      {
        isAvailable: isAvailable,
      }
    );

    return res.status(200).send({
      msg: "Success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  requestOrder,
  editOrder,
  deleteOrder,
  responseOrder,
  getAllOrder,
};
