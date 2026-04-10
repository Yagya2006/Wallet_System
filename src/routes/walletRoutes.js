const express = require("express");
const auth = require("../middleware/authMiddleware");
const { deposit } = require("../controllers/walletController");

const router = express.Router();

router.post("/deposit", auth, deposit);

module.exports = router;