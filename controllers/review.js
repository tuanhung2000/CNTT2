require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const order = require("../models/order");
const review = require("../models/review");

const getReviews = async (req, res) => {
  //all users can read
  try {
    const Reviews = await review.find({});
    return res.status(200).send({
      Reviews,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const postReview = async (req, res) => {
  //type: driver or vehicle
  //type id: driverID or vehicleID
  try {
    const username = getAccess(req.headers["authorization"]);
    const { type, typeID, rate, content } = req.body;

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

    if (type === "vehicle") {
      const Vehicle = vehicle.findOne({
        id: typeID,
      });

      if (!Vehicle) {
        return res.status(403).send({
          msg: "Not Found!!!",
        });
      }

      review.create({
        userID: User._id,
        type: type,
        typeID: typeID,
        rate: rate,
        content: content,
      });
      return res.status(200).send({
        msg: "Review completed",
      });
    } else {
      const Driver = vehicle.findOne({
        _id: typeID,
        role: "driver",
      });

      if (!Driver) {
        return res.status(403).send({
          msg: "Not Found!!!",
        });
      }

      review.create({
        userID: Driver._id,
        type: type,
        typeID: typeID,
        rate: rate,
        content: content,
      });
      return res.status(200).send({
        msg: "Review completed",
      });
    }
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const editReview = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);
    const { reviewID, rate, content } = req.body;

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
    const Review = review.findOne({
      _id: reviewID,
    });

    if (Review) {
      review.findOneAndUpdate(
        {
          _id: reviewID,
        },
        {
          rate: rate,
          content: content,
        }
      );
      return res.status(200).send({
        msg: "Edit completed",
      });
    }

    return res.status(401).send({
      msg: "Review not Found!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const username = getAccess(req.headers["authorization"]);
    const { reviewID } = req.body;

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
    const Review = review.findOne({
      _id: reviewID,
    });

    if (Review) {
      review.findOneAndDelete({
        _id: reviewID,
      });
      return res.status(200).send({
        msg: "Delete completed",
      });
    }

    return res.status(401).send({
      msg: "Review not Found!!!",
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getReviews,
  postReview,
  editReview,
  deleteReview,
};
