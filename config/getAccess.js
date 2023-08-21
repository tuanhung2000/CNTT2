require("dotenv").config();
const jwt = require("jsonwebtoken");

const getAccess = (value) => {
  console.log(value);
  if (typeof value === "undefined" || value == "") {
    return false;
  }
  const authorization = value.split(" ")[1];
  if (typeof authorization === "undefined" || authorization == "") {
    return false;
  }
  const decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);

  return decoded.UserInfo.username;
};

module.exports = { getAccess };
