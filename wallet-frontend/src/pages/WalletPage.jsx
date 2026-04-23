import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

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

const handleTransfer = async () => {
  if (!receiverId) {
    setError("Receiver ID is required");
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    setError("Enter a valid amount");
    return;
  }

  const response = await fetch("http://localhost:5000/api/wallet/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      receiverId,
      amount: Number(amount)
    })
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  setError("");
  fetchBalance();
  setAmount("");
  setReceiverId("");
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
    <div style={{ padding: "20px" }}>
      <h1>Wallet App</h1>
     <p>Balance: £{balance}</p>
      <input
  value={receiverId}
  onChange={(e) => setReceiverId(e.target.value)}
  placeholder="Enter receiver userId"
/>
    <button onClick={handleTransfer}>Transfer</button>

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
