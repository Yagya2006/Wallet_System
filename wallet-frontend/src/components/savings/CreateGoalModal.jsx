import React, { useState } from "react";
import axios from "axios";

const CreateGoalModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const createGoal = async () => {
    try {
      await axios.post("http://localhost:5000/api/savings/create", {
        name,
        targetAmount: Number(targetAmount)
        
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      onClose();
      window.location.reload(); // Refresh the page to show the new goal
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating goal");
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Create Savings Goal</h3>

        <input
          type="text"
          placeholder="Goal name (e.g., iPad)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <button onClick={createGoal}>Create</button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default CreateGoalModal;
