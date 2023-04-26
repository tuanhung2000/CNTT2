const express = require("express");
const router = express.Router();
const { signup, login, changePassword } = require("../controllers/auth");

router.post("/signup", signup);

router.post("/login", login);

router.patch("/change-password", changePassword);

module.exports = router;
