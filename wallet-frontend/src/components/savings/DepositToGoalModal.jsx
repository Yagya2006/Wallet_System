import React, { useState } from "react";
import axios from "axios";

const DepositToGoalModal = ({ goalId, close, refreshGoals }) => {
  const [amount, setAmount] = useState("");

  const deposit = async () => {
    try {
      await axios.post("http://localhost:5000/api/savings/deposit", {
        goalId,
        amount: Number(amount)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      refreshGoals();
      close();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding money");
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Add Money</h3>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={deposit}>Add</button>
        <button onClick={close} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default DepositToGoalModal;
