require("dotenv").config();
const jwt = require("jsonwebtoken");

const getAccess = (value) => {
  const authorization = value.split(" ")[1];
  const decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);

  return decoded.UserInfo.username;
};

module.exports = { getAccess };
