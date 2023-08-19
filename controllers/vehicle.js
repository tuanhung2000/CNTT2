require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const account = require("../models/account");
const vehicle = require("../models/vehicle");
const vehicleList = require("../models/vehicleList");
const makes = require("../models/makes");
const models = require("../models/models");
const order = require("../models/order");
const { getAccess } = require("../config/getAccess");
const vehicleSpec = require("../models/vehicleSpec");
const { getReviews } = require("../controllers/review")

const getAllVehicle = async (req, res) => {
  try {
    const Vehicle = await vehicle.find({});

    const Order = await order.find({
      isCompleted: false
    })

    let result = []
    for (let i = 0; i < Order.length; i++) {
      let vehicleID = Order[i].vehicleID
      console.log(i)
      for (let j = 0; j < Vehicle.length; j++) {
        if (Vehicle[j].id == Order[i].vehicleID) {
          console.log(Vehicle[j].id, vehicleID)
          result.push(Vehicle[j])
          console.log(j)
        } else {
          console.log('.')
        }
      }

    }

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getVehicle = async (req, res) => {
  try {
    const Vehicle = await vehicle.findOne({ _id: req.params.vehicleID });

    if (!Vehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }
    const VehicleSpec = await vehicleSpec.findOne({
      vehicleID: Vehicle._id,
    });

    const owner = await user.findOne({
      _id: Vehicle.driverID
    })

    const reviews = await getReviews(Vehicle._id)

    return res.status(200).send({
      vehicle: {
        Vehicle,
        VehicleSpec,
      },
      reviews: reviews,
      owner: owner
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const getOwnVehicle = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({ username: username });

    if (!User) {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const ownedVehicle = await vehicle.find({
      driverID: User.id
    })

    return res.status(200).send({
      ownedVehicle
    })


  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

//create or regist new vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      image,
      licensePlate,
      price,
      extraFee,
      type,
      make,
      model,
      year,
      feature,
      description,
      address,
      rent,
      isSelfDrive,
      powers,
      fuelType,
      insurance,
      consumption,
      maxSpeed,
      numberConstructor,
      seatNumbers
    } = req.body;
    const username = getAccess(req.headers["authorization"]);
    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({ username: username });

    if (!User || User.role == "customer") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const existedVehicle = await vehicle.findOne({
      licensePlate: licensePlate,
    });
    if (existedVehicle) {
      return res.status(401).send({
        msg: "Vehicle already exist!!!",
      });
    }

    const selfDriveVehicle = await vehicle.findOne({
      driverID: User._id,
      isSelfDrive: true,
    });

    if (selfDriveVehicle && isSelfDrive == true) {
      return res.status(401).send({
        msg: "Driver already have own self drive vehicle",
      });
    }

    // const Make = await makes.findOne({
    //   make: make,
    // });
    // console.log('6')



    // const highestMakeID = await makes.find({}).sort({ ID: -1 }).limit(1);

    // if (!Make) {
    //   await makes.create({
    //     ID: +highestMakeID + 1,
    //     make: make,
    //   });
    //   await models.create({
    //     model: model,
    //     makeID: +highestMakeID + 1,
    //   });
    // }
    // console.log('8')
    // const Model = await models.findOne({
    //   makeID: Make.ID,
    // });

    // console.log('7', Model)
    // if (Make && !Model) {
    //   await model.create({
    //     model: model,
    //   });
    // }
    // console.log('9')

    const Vehicle = await vehicle.create({
      driverID: User._id,
      image: image,
      licensePlate: licensePlate,
      price: price,
      extraFee: extraFee,
      rate: "0.0",
      address: address,
      rent: rent,
      make: make,
      model: model,
      year: year,
      feature: feature,
      description: description,
      isSelfDrive: isSelfDrive
    });

    const VehicleSpec = await vehicleSpec.create({
      vehicleID: Vehicle._id,
      powers: powers,
      fuelType: fuelType,
      insurance: insurance,
      consumption: consumption,
      maxSpeed: maxSpeed,
      type: type,
      numberConstructor: numberConstructor,
      seatNumbers: seatNumbers
    });

    return res
      .status(200)
      .send({ msg: "Vehicle registration successful", Vehicle, VehicleSpec });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editVehicle = async (req, res) => {
  try {
    const { image, price, extraFee, feature, description } = req.body;

    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }

    const User = await user.findOne({
      username: username,
    });

    if (!User || User.role == "customer") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const ownedVehicle = await vehicle.findById({
      _id: req.params.vehicleID,
      driverID: User.role != 'admin' ? User.id : ''
    });


    if (!ownedVehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    const editedVehicle = await vehicle.findByIdAndUpdate(
      {
        _id: req.params.vehicleID,
      },
      {
        image: image,
        price: price,
        extraFee: extraFee,
        feature: feature,
        description: description,
      }
    );

    return res
      .status(200)
      .send({ msg: "Vehicle update successful", editedVehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const deleteVehicle = async (req, res) => {
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

    if (!User || User.role == "customer") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const ownedVehicle = await vehicle.findOne({
      _id: req.params.vehicleID,
      driverID: User.role !== 'admin' ? User.id : ''
    });

    if (!ownedVehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    await vehicleSpec.findOneAndDelete({
      vehicleID: ownedVehicle._id
    })

    await vehicle.findByIdAndDelete({
      _id: req.params.vehicleID,
    });

    return res
      .status(200)
      .send({ msg: "Delete vehicle successful", ownedVehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const createVehicleList = async (req, res) => {
  try {
    console.log(req.body);
    const { year, make, model, category } = req.body;

    const Vehicle_List = await vehicleList.create({
      year: "eaa",
      make: "aaa",
      model: "aaa",
      category: "aaad",
    });

    return res
      .status(200)
      .send({ msg: "Vehicle registration successful", Vehicle_List });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const queryVehicle = async (req, res) => {
  try {
    const { make } = req.body;
    const MakesDB = await makes.find({});

    if (!make) {
      return res.status(200).send({
        makes: MakesDB,
      });
    }
    if (make) {
      const CurrentMake = await makes.find({ make: make });
      const ModelsDB = await models.find({ makeID: parseInt(CurrentMake.ID) });
      return res.status(200).send({
        makes: MakesDB,
        models: ModelsDB,
      });
    }
    return res.status(200).send({
      makes: MakesDB,
    });
  } catch (e) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllVehicle,
  getVehicle,
  createVehicle,
  editVehicle,
  deleteVehicle,
  createVehicleList,
  queryVehicle,
};
