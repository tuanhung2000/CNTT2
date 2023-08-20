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

    const Order = await order.find({
      userID: User.id
    })

    if (!Order) {
      const vehicleList = await vehicle.find({
        driverID: User.id
      })
      const orderList = await order.find({})

      for (let i = 0; i < vehicleList.length; i++) {
        // for (let j = 0; j < orderList.length; j++) {
        //   if (vehicleList[i].id == orderList[j].vehicleID) {

        //   }
        // }

        orderList.filter((order) => { return order.vehicleID == vehicleList[i].id })
      }

      console.log(orderList)

      // const driverOrder = await 
      return res.status(200).send({
        orders: await order.find({}),
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
      userID: User.id
    })

    if (!Wallet || Wallet.amount - total < 0) {
      return res.status(401).send({
        msg: "User amount not enough!!",
      });
    }

    await vehicle.findByIdAndUpdate(
      {
        _id: vehicleID
      },
      {
        isAvailable: false
      }
    )

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
    const { vehicleID, orderID, isAccepted, isCompleted } = req.body;

    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const Order = await order.findOne({
      _id: orderID
    });


    if (!Order) {
      return res.status(401).send({
        msg: "Not found order",
      });
    }

    const Vehicle = await vehicle.findOne({
      _id: Order.vehicleID,
    });


    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    const User = await user.findOne({
      username: username,
      _id: Vehicle.driverID
    });

    if (!User) {
      return res.status(401).send({
        msg: "Not found user",
      });
    }

    if (Vehicle.isAvailable === true && Vehicle.isCompleted === true) {
      return res.status(401).send({
        msg: "Cannot response",
      });
    }

    if (isCompleted) {
      const userWallet = await wallet.findOne({
        userID: Order.userID
      })

      if (!userWallet || userWallet.amount - Order.total < 0) {
        return res.status(401).send({
          msg: "User amount not enough!!",
        });
      }

      if (userWallet.amount - Order.total > 0) {
        await order.findByIdAndUpdate(
          {
            _id: orderID,
          },
          {
            isCompleted: isCompleted,
          }
        );

        await wallet.findOneAndUpdate(
          {
            userID: Order.userID
          },
          {
            amount: userWallet.amount - Order.total
          }
        )

        const Vehicle = await vehicle.findOne({
          _id: Order.vehicleID
        })

        const Driver = await user.findOne({
          _id: Vehicle.driverID
        })

        const driverWallet = await wallet.findOne({
          userID: Driver.id
        })

        await wallet.findByIdAndUpdate(
          {
            _id: driverWallet.id
          },
          {
            amount: driverWallet.amount + total
          }
        )


        await vehicle.findByIdAndUpdate(
          {
            _id: vehicleID
          },
          {
            isAvailable: true,
            isAccepted: false
          }
        )

        return res.status(200).send({
          msg: "Completed",
        });
      }
    }

    await vehicle.findByIdAndUpdate(
      {
        _id: vehicleID,
      },
      {
        isAccepted: isAccepted,
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
  getOwnedOrder
};
