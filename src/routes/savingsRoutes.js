const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const savingsController = require("../controllers/savingsController");

router.post("/create", auth, savingsController.createGoal);
router.post("/deposit", auth, savingsController.depositToGoal);
router.get("/goals", auth, savingsController.getGoals);
router.delete("/delete/:goalId", auth, savingsController.deleteGoal);

module.exports = router;
