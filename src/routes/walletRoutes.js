const express = require("express");
const auth = require("../middleware/authMiddleware");
const { deposit,getBalance,withdraw,getTransactions,transfer } = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/drop-tx-index", async (req, res) => {
  try {
    const result = await Transaction.collection.dropIndex("transactionId_1");
    res.send("Index removed: " + result);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});
const Wallet = require("../models/Wallet");

router.get("/debug-wallets", async (req, res) => {
  const wallets = await Wallet.find();
  res.json(wallets);
});
router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);
router.get("/balance", authMiddleware, getBalance);
router.get("/transactions", authMiddleware, getTransactions);
router.post("/transfer", authMiddleware, transfer);


const Transaction = require("../models/Transaction");

module.exports = router;