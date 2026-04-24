const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
// ---------------------------
// GET BALANCE
// ---------------------------
exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json({ balance: wallet.balance });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// DEPOSIT
// ---------------------------
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const previousBalance = wallet.balance;
    wallet.balance += amount;

    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount,
      previousBalance,
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

// ---------------------------
// WITHDRAW
// ---------------------------
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const previousBalance = wallet.balance;
    wallet.balance -= amount;

    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: "withdraw",
      amount,
      previousBalance,
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

// ---------------------------
// GET TRANSACTIONS
// ---------------------------
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
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

// ---------------------------
// TRANSFER
// ---------------------------
exports.transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Find receiver user
    const receiverUser = await User.findOne({ email: receiverEmail });
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Prevent self-transfer
    if (receiverUser._id.toString() === senderId) {
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    // Fetch sender wallet
    const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
    if (!senderWallet) {
      return res.status(404).json({ message: "Sender wallet not found" });
    }

    // Fetch receiver wallet
    const receiverWallet = await Wallet.findOne({ userId: receiverUser._id }).session(session);
    if (!receiverWallet) {
      return res.status(404).json({ message: "Receiver wallet not found" });
    }

    // Check balance
    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Store previous balances
    const senderPrev = senderWallet.balance;
    const receiverPrev = receiverWallet.balance;

    // Update balances
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // Log sender transaction
    await Transaction.create([{
      userId: senderId,
      type: "transfer_sent",
      amount,
      previousBalance: senderPrev,
      newBalance: senderWallet.balance,
      to: receiverEmail
    }], { session });

    // Log receiver transaction
    await Transaction.create([{
      userId: receiverUser._id,
      type: "transfer_received",
      amount,
      previousBalance: receiverPrev,
      newBalance: receiverWallet.balance,
      from: req.user.email
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Transfer successful",
      balance: senderWallet.balance
    });

  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Transfer failed" });
  }
};
