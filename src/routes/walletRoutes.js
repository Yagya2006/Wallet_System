const express = require("express");
const auth = require("../middleware/authMiddleware");
const { deposit,getBalance } = require("../controllers/walletController");
const router = express.Router();

router.post("/deposit", auth, deposit);
router.get("/balance", auth, getBalance);

module.exports = router;