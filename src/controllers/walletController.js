const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

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
    const { receiverId, amount } = req.body;
    const senderId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Cannot transfer to self
    if (senderId === receiverId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    // Fetch sender wallet
    const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
    if (!senderWallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender wallet not found" });
    }

    // Fetch receiver wallet
    const receiverWallet = await Wallet.findOne({ userId: receiverId }).session(session);
    if (!receiverWallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Receiver wallet not found" });
    }

    // Check balance
    if (senderWallet.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Calculate balances
    const senderPrev = senderWallet.balance;
    const senderNew = senderPrev - amount;

    const receiverPrev = receiverWallet.balance;
    const receiverNew = receiverPrev + amount;

    // Update sender wallet
    senderWallet.balance = senderNew;
    await senderWallet.save({ session });

    // Update receiver wallet
    receiverWallet.balance = receiverNew;
    await receiverWallet.save({ session });

    // Log sender transaction
    await Transaction.create([{
      userId: senderId,
      type: "transfer_sent",
      amount,
      previousBalance: senderPrev,
      newBalance: senderNew,
      to: receiverId
    }], { session });

    // Log receiver transaction
    await Transaction.create([{
      userId: receiverId,
      type: "transfer_received",
      amount,
      previousBalance: receiverPrev,
      newBalance: receiverNew,
      from: senderId
    }], { session });

    // Commit
    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Transfer successful",
      senderBalance: senderNew,
      receiverBalance: receiverNew
    });

  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Transfer failed" });
  }
};