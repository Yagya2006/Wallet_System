const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

module.exports = app;

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const walletRoutes = require("./src/routes/walletRoutes");
app.use("/api/wallet", walletRoutes);