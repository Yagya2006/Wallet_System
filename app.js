const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());




const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const walletRoutes = require("./src/routes/walletRoutes");
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});
module.exports = app;