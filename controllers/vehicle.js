require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const account = require("../models/account");
const vehicle = require("../models/vehicle");
const { getAccess } = require("../config/getAccess");

const getAllVehicle = async (req, res) => {
  try {
    const Vehicle = await vehicle.find({});
    return res.status(200).send({ Vehicle });
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

    return res.status(200).send({ Vehicle });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const createVehicle = async (req, res) => {
  try {
    const {
      image,
      licensePlate,
      price,
      extraFee,
      type,
      model,
      feature,
      description,
    } = req.body;
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      return res.status(403).send({
        msg: "Authentication!!!",
      });
    }
    const User = await user.findOne({ username: username });

    if (!User || User.role == "client") {
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

    const onlyVehicle = await vehicle.findOne({
      driverID: User._id,
      type: "Have a Driver",
    });

    if (type == "Have a Driver" && onlyVehicle) {
      return res.status(401).send({
        msg: "Driver already have own vehicle",
      });
    }

    const Vehicle = await vehicle.create({
      driverID: User._id,
      image: image,
      licensePlate: licensePlate,
      price: price,
      extraFee: extraFee,
      rate: "0.0",
      type: type,
      model: model,
      feature: feature,
      description: description,
    });

    return res
      .status(200)
      .send({ msg: "Vehicle registration successful", Vehicle });
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

    if (!User || User.role == "client") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }
    const checkedVehicle = await vehicle.findById({
      _id: req.params.vehicleID,
    });

    if (!checkedVehicle) {
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

    if (!User || User.role == "client") {
      return res.status(401).send({
        msg: "Not allowed",
      });
    }

    const onwedVehicle = await vehicle.findOne({
      _id: req.params.vehicleID,
    });

    if (!onwedVehicle) {
      return res.status(401).send({
        msg: "Not found vehicle",
      });
    }

    await vehicle.findByIdAndDelete({
      _id: req.params.vehicleID,
    });

    return res
      .status(200)
      .send({ msg: "Delete vehicle successful", onwedVehicle });
  } catch (error) {
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
};
