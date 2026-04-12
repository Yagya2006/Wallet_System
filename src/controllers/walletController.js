const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");


exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({
      balance: wallet.balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    // Find wallet of logged-in user
    const wallet = await Wallet.findOne({ userId: req.user });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update balance
    wallet.balance += amount;

    await wallet.save();
    await Transaction.create({
  userId: req.user,
  type: "deposit",
  amount,
  previousBalance: wallet.balance - amount,
  newBalance: wallet.balance
});

    return res.status(200).json({
      message: "Deposit successful",
      balance: wallet.balance
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    const wallet = await Wallet.findOne({ userId: req.user });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;

    await wallet.save();
    await Transaction.create({
  userId: req.user,
  type: "withdraw",
  amount,
  previousBalance: wallet.balance + amount,
  newBalance: wallet.balance
});

    return res.status(200).json({
      message: "Withdraw successful",
      balance: wallet.balance
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};