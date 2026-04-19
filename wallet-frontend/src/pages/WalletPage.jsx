import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

import Balance from "../Balance";


function WalletPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const fetchBalance = async () => {
    try {
      const response = await fetch("http://localhost:5000/balance");
      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError("Could not fetch balance");
    }
  };
  const handleWithdraw = async () => {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    setError("Enter a valid amount");
    return;
  }

  const response = await fetch("http://localhost:5000/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Number(amount) }),

  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  setError("");
  fetchBalance();
  setAmount("");
};

const handleAddMoney = async () => {
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    setError("Enter a valid amount");
    return;
  }

  const response = await fetch("http://localhost:5000/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Number(amount) }),

  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  setError("");
  fetchBalance();
  setAmount("");
};

useEffect(() => {
  fetchBalance();
}, []);
 
  return (
    <div style={{ padding: "20px" }}>
      
      <h1>Wallet App</h1>
     <p>Balance: £{balance}</p>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />

      <button onClick={handleAddMoney}>Add Money</button>
      <button onClick={handleWithdraw}>Withdraw</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
  );
}
export default WalletPage;
