require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");
const wallet = require("../models/wallet");

const getAllOrder = async (req, res) => {
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
      const Order = await order.find({
        userID: User._id,
        isCompleted: true,
      });
      let VehicleList = [];
      Order.forEach(async (or) => {
        VehicleList.push(
          await vehicle.findOne({
            _id: or.vehicleID,
          })
        );
      });
      return res.status(200).send({
        orders: Order,
        vehicles: VehicleList,
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

const getOwnedOrder = async (req, res) => {
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

    if (User.role != "owner") {
      let Order = await order.find({
        userID: User.id,
      });

      const VehicleList = [];
      const DriverList = [];
      const getVehicleList = async () => {
        for (let i = 0; i < Order.length; i++) {
          let ve = await vehicle.findOne({
            _id: Order[i].vehicleID,
          });
          VehicleList.push(ve);
        }
        return VehicleList;
      };

      const getDriverList = async () => {
        for (let i = 0; i < Order.length; i++) {
          let ve = await user.findOne({
            _id: Order[i].driverID,
          });
          DriverList.push(ve);
        }
        return DriverList;
      };

      return res.status(200).send({
        orders: Order,
        VehicleList: await getVehicleList(),
        DriverList: await getDriverList(),
      });
    }
    let Order = await order.find({
      driverID: User.id,
    });

    const VehicleList = [];
    const UserList = [];
    const getVehicleList = async () => {
      for (let i = 0; i < Order.length; i++) {
        let ve = await vehicle.findOne({
          _id: Order[i].vehicleID,
        });
        VehicleList.push(ve);
      }
      return VehicleList;
    };

    const getUserList = async () => {
      for (let i = 0; i < Order.length; i++) {
        let ve = await user.findOne({
          _id: Order[i].userID,
        });
        UserList.push(ve);
      }
      return UserList;
    };

    return res.status(200).send({
      orders: Order,
      vehicleList: await getVehicleList(),
      userList: await getUserList(),
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getCurrentOrder = async (req, res) => {
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
    const Order = await order.find({
      userID: User._id,
      isHandle: true,
    });

    const VehicleList = [];
    const getVehicleList = async () => {
      for (let i = 0; i < Order.length; i++) {
        let ve = await vehicle.findOne({
          _id: Order[i].vehicleID,
        });
        VehicleList.push(ve);
      }
      return VehicleList;
    };

    return res.status(200).send({
      orders: Order,
      vehicles: await getVehicleList(),
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const requestOrder = async (req, res) => {
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

    const Wallet = await wallet.findOne({
      userID: User.id,
    });

    if (!Wallet || Wallet.amount - total < 0) {
      return res.status(401).send({
        msg: "User amount not enough!!",
      });
    }

    await order.create({
      vehicleID: vehicleID,
      driverID: Vehicle.driverID,
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
    const { vehicleID, orderID, isResponse } = req.body;

    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const Order = await order.findOne({
      _id: orderID,
    });

    const customer = await user.find({
      _id: Order.userID,
    });

    if (!customer) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
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

    const User = await user.findOne({
      username: username,
    });

    if (!User && User.role != "owner") {
      return res.status(401).send({
        msg: "Not found user or not allowed",
      });
    }
    const userWallet = await wallet.findOne({
      userID: Order.userID,
    });
    if (!userWallet) {
      return res.statue(401).send({
        msg: "User amount not enough",
      });
    }

    const ownerWallet = await wallet.findOne({
      userID: Vehicle.driverID,
    });

    if (!ownerWallet) {
      await wallet.create({
        userID: Vehicle.driverID,
        amount: parseInt(Order.total),
      });
    }
    const userAmount = userWallet.amount - parseInt(Order.total);
    const ownerAmount = ownerWallet.amount + parseInt(Order.total);
    if (!Vehicle.isAvailable) {
      return res.status(401).send({
        msg: "Vehicle not available!!!",
      });
    }

    if (isResponse) {
      if (userAmount < 0) {
        return res.status(401).send({
          msg: "Amount not enough",
        });
      }
      //user
      await wallet.findOneAndUpdate(
        {
          userID: Order.userID,
        },
        {
          amount: userAmount,
        }
      );
      //owner
      await wallet.findOneAndUpdate(
        {
          userID: Order.driverID,
        },
        {
          amount: ownerAmount,
        }
      );

      await vehicle.findOneAndUpdate(
        {
          _id: vehicleID,
        },
        {
          isAvailable: false,
        }
      );

      const orderList = await order.find({
        vehicleID: vehicleID,
      });

      orderList.forEach(async (or) => {
        if (or._id != orderID) {
          await order.findOneAndUpdate(
            {
              _id: or._id,
            },
            {
              isHandle: true,
              isResponse: false,
            }
          );
        }
      });
    }
    await order.findOneAndUpdate(
      {
        _id: Order.id,
      },
      {
        isHandle: true,
        isResponse: isResponse,
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

const completeOrder = async (req, res) => {
  try {
    const { vehicleID, orderID, isCompleted } = req.body;

    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const Order = await order.findOne({
      _id: orderID,
      isResponse: true,
      isHandle: true,
    });

    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
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

    const User = await user.findOne({
      username: username,
      _id: Vehicle.driverID,
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }
    //not completed
    if (!isCompleted) {
      await order.findOneAndUpdate(
        {
          _id: orderID,
        },
        {
          isCompleted: isCompleted,
        }
      );
      return res.status(200).send({
        msg: "Order not completed",
        order: Order,
      });
    }
    //completed
    await order.findOneAndUpdate(
      {
        _id: orderID,
      },
      {
        isCompleted: isCompleted,
      }
    );
    await vehicle.findOneAndUpdate(
      {
        _id: Vehicle.id,
      },
      {
        isAvailable: true,
      }
    );
    return res.status(200).send({
      msg: "Order completed!!!",
      order: Order,
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
  getOwnedOrder,
  completeOrder,
  getCurrentOrder,
};
