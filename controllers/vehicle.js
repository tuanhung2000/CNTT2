require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const account = require("../models/account");
const vehicle = require("../models/vehicle");
const { getAccess } = require("../config/getAccess");

const createVehicle = async (req, res) => {
  try {
    const {
      driverID,
      image,
      licensePlate,
      price,
      extraFee,
      rate,
      type,
      feature,
      description,
    } = req.body;
    const username = getAccess(req.headers["authorization"]);

    if (!username) {
      res.status(403).send({
        msg: "A token is require for authentication!!!",
      });
    }
    const User = await user.findOne({ username: username });

    if (User || Account) {
      return res.status(401).send({
        msg: "User already exist!!!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await account.create({
      username: username,
      password: hashedPassword,
    });

    await user.create({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phoneNumber: phoneNumber,
      createdDate: new Date(),
    });
    return res.status(200).send({
      msg: "Created user success!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editVehicle = async (req, res) => {};

const deleteVehicle = async (req, res) => {
  try {
    const { username, password } = req.body;

    const Account = await account.findOne({ username: username });
    const User = await user.findOne({ username: username });

    if (!User || !Account || !password) {
      return res.status(401).send({
        msg: "Invalid Username or Password",
      });
    }

    const comparedPassword = await bcrypt.compare(password, Account.password);

    if (!comparedPassword) {
      return res.status(401).send({
        msg: "Invalid Username or Password",
      });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: username,
          role: User.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).send({
      msg: "Logged in success!!!",
      accessToken,
      User,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  createVehicle,
  editVehicle,
  deleteVehicle,
};
