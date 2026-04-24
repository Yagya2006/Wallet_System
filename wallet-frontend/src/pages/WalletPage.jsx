import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./WalletPage.css";
import Balance from "../Balance";


function WalletPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const fetchBalance = async () => {
    try {
     const response = await fetch("http://localhost:5000/api/wallet/balance", {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
});


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

  const response = await fetch("http://localhost:5000/api/wallet/withdraw", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
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

  const response = await fetch("http://localhost:5000/api/wallet/deposit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
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
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  } else {
    fetchBalance();
  }
}, []);

 

  return (
  <div className="wallet-page">

    <h1 className="wallet-title">Wallet App</h1>

    {/* Balance Card */}
    <div className="balance-card">
      <p className="balance-label">Current Balance</p>
      <h2 className="balance-amount">£{balance}</h2>
    </div>

    {/* Amount Input */}
    <div className="amount-section">
      <input
        className="amount-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
    </div>

    {/* Action Buttons */}
    <div className="action-buttons">
      <button className="add-btn" onClick={handleAddMoney}>Add Money</button>
      <button className="withdraw-btn" onClick={handleWithdraw}>Withdraw</button>
    </div>

    {error && <p className="error">{error}</p>}
  </div>
);
}
export default WalletPage;
