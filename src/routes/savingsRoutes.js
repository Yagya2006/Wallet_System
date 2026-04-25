const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const savingsController = require("../controllers/savingsController");

router.post("/create", auth, savingsController.createGoal);
router.post("/deposit", auth, savingsController.depositToGoal);
router.get("/goals", auth, savingsController.getGoals);

module.exports = router;
