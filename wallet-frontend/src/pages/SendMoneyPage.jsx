import { useState } from "react";
import "./SendMoneyPage.css";

function SendMoneyPage() {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    setError("");

    if (!receiverId || !amount) {
      setError("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/wallet/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId,
          amount: Number(amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Transfer failed");
        return;
      }

      // Clear fields on success
      setReceiverId("");
      setAmount("");

      alert("Transfer successful");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="send-container">
      <h2>Send Money</h2>
       
      <input
        placeholder="Enter receiver userId"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />

      <input
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleTransfer}>Send Money</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SendMoneyPage;
