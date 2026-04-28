const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signup,login } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);

module.exports = router;