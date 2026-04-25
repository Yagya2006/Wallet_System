const SavingsGoal = require("../models/SavingsGoal");
const Wallet = require("../models/Wallet");

// ---------------------------
// CREATE GOAL
// ---------------------------
exports.createGoal = async (req, res) => {
  try {
    const { name, targetAmount } = req.body;
    const userId = req.user.id;

    const goals = await SavingsGoal.find({ userId });

    const activeGoals = goals.filter(g => !g.isCompleted);

    if (activeGoals.length >= 3) {
      return res.status(400).json({
        message: "You already have 3 active goals. Complete one to create a new goal."
      });
    }

    const goal = await SavingsGoal.create({
      userId,
      name,
      targetAmount
    });

    return res.json({ message: "Goal created", goal });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// ADD MONEY TO GOAL
// ---------------------------
exports.depositToGoal = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const userId = req.user.id;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const goal = await SavingsGoal.findOne({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    wallet.balance -= amount;
    goal.currentAmount += amount;

    // AUTO-COMPLETE LOGIC
    if (goal.currentAmount >= goal.targetAmount) {
      wallet.balance += goal.currentAmount; // return all money
      goal.currentAmount = 0;
      goal.isCompleted = true;
    }

    await wallet.save();
    await goal.save();

    return res.json({ message: "Money added to goal", goal, walletBalance: wallet.balance });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET ALL GOALS
// ---------------------------
exports.getGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    return res.json({ goals });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
