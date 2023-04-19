require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const account = require("../models/account");

const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
    } = req.body;
    const Account = await account.findOne({ username: username });
    const User = await user.findOne({ username: username });
    if (User || Account) {
      return res.status(401).send({
        msg: "User already exist!!!",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await Account.create({
      username: username,
      password: hashPassword,
    });

    await User.create({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phoneNumber: phoneNumber,
      createdDate: new Date(),
    });

    return req.status(200).send({
      msg: "Created user success!!!",
    });
  } catch (error) {
    return req.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const Account = await account.findOne({ username: username });
    const User = await user.findOne({ username: username });

    if (!User || !Account || !password) {
      throw new Error("Invalid Username or Password", 401);
    }

    const comparedPassword = await bcrypt.compare(password, Account.password);

    if (!comparedPassword) {
      throw new Error("Invalid Username or Password", 401);
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: username,
          role: user.role,
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
    throw new Error("Internal Server Error", 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;

    const Account = await account.findOne({ username: username });

    const comparedPassword = await bcrypt.compare(password, Account.password);

    if (!comparedPassword) {
      throw new Error("Invalid Password", 401);
    }
    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    await account.findByIdAndUpdate(
      {
        _id: Account._id,
      },
      {
        password: hashNewPassword,
      }
    );

    return res.status(200).send({
      msg: "Update password success!!",
    });
  } catch (error) {
    throw new Error("Internal Server Error", 500);
  }
};

module.exports = {
  signup,
  login,
  changePassword,
};
