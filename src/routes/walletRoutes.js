const express = require("express");
const auth = require("../middleware/authMiddleware");
const { deposit,getBalance,withdraw,getTransactions,transfer } = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const Wallet = require("../models/Wallet");


router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);
router.get("/balance", authMiddleware, getBalance);
router.get("/transactions", authMiddleware, getTransactions);
router.post("/transfer", authMiddleware, transfer);


const Transaction = require("../models/Transaction");

module.exports = router;