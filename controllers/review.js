const { getAccess } = require("../config/getAccess");
const user = require("../models/user");
const vehicle = require("../models/vehicle");
const review = require("../models/review");

const getReviews = async (contentID) => {
  //all users can read by vehicle rate or driver rate
  const Vehicle = await vehicle.findOne({
    _id: contentID,
  });

  if (Vehicle) {
    return await review.find({
      typeID: Vehicle._id,
    });
  } else {
    const User = await user.findOne({
      _id: contentID,
      role: "owner",
    });
    return await review.find({
      typeID: User._id,
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
    const Vehicle = await vehicle.findOne({
      _id: typeID,
    });

    //
    const allCurrentReview = await review.find({ typeID: typeID });
    let scores = [];

    if (allCurrentReview.length > 0) {
      allCurrentReview.forEach((val) => {
        scores.push(val.rate);
      });
      function calculate() {
        var total = 0;
        for (var i = 0; i < scores.length; i++) {
          total += parseFloat(scores[i]);
        }
        average = (total / scores.length).toFixed(2);
        return average;
      }
    }

    //
    if (Vehicle) {
      review.create({
        userID: User._id,
        fullname: User.firstName + User.lastName,
        type: type,
        typeID: typeID,
        rate: rate,
        content: content,
      });

      await vehicle.findOneAndUpdate(
        {
          _id: typeID,
        },
        { rate: allCurrentReview > 0 ? calculate() : rate }
      );

      return res.status(200).send({
        msg: "Review completed",
      });
    } else {
      const Driver = await user.findOne({
        _id: typeID,
        role: "owner",
      });
      if (Driver) {
        review.create({
          userID: User._id,
          fullname: User.firstName + User.lastName,
          type: type,
          typeID: typeID,
          rate: rate,
          content: content,
        });

        await user.findOneAndUpdate(
          {
            _id: typeID,
            role: "owner",
          },
          { rate: allCurrentReview > 0 ? calculate() : rate }
        );

        return res.status(200).send({
          msg: "Review completed",
        });
      }
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
      //
      const allCurrentReview = await review.find({ typeID: typeID });
      let scores = [];
      allCurrentReview.forEach((val) => {
        scores.push(val.rate);
      });
      function calculate() {
        var total = 0;
        for (var i = 0; i < scores.length; i++) {
          total += parseFloat(scores[i]);
        }
        average = (total / scores.length).toFixed(2);
        return average;
      }
      //

      await vehicle.findOneAndUpdate(
        {
          _id: typeID,
          role: "owner",
        },
        { rate: calculate() }
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

      //
      const allCurrentReview = await review.find({ typeID: typeID });
      let scores = [];
      allCurrentReview.forEach((val) => {
        scores.push(val.rate);
      });
      function calculate() {
        var total = 0;
        for (var i = 0; i < scores.length; i++) {
          total += parseFloat(scores[i]);
        }
        average = (total / scores.length).toFixed(2);
        return average;
      }
      //
      await vehicle.findOneAndUpdate(
        {
          _id: typeID,
          role: "owner",
        },
        { rate: calculate() }
      );

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
