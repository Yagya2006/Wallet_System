const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signup,login } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user= await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect= await bcrypt.compare(password,user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" });
    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;