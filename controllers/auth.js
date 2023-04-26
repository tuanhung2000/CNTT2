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
      role,
    } = req.body;
    const Account = await account.findOne({ username: username });
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
      role: role || "client",
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

const login = async (req, res) => {
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

const changePassword = async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;

    const Account = await account.findOne({ username: username });

    if (!Account) {
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

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    await account.findByIdAndUpdate(
      {
        _id: Account._id,
      },
      {
        password: newHashedPassword,
      }
    );

    return res.status(200).send({
      msg: "Update password success!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
};
