const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // find user's wallet
    const wallet = await Wallet.findOne({ userId: req.user });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // update balance
    wallet.balance += amount;
    await wallet.save();

    // create transaction
    await Transaction.create({
      transactionId: uuidv4(),
      from: null,
      to: req.user,
      amount,
      type: "DEPOSIT",
      status: "SUCCESS",
    });

    res.json({
      message: "Deposit successful",
      balance: wallet.balance,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};