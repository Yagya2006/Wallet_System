const express = require("express");
const auth = require("../middleware/authMiddleware");
const { deposit,getBalance,withdraw,getTransactions } = require("../controllers/walletController");
const router = express.Router();

router.post("/deposit", auth, deposit);
router.post("/withdraw", auth, withdraw);
router.get("/balance", auth, getBalance);
router.get("/transactions", auth, getTransactions);
module.exports = router;