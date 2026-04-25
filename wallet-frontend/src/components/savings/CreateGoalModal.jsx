import React, { useState } from "react";
import axios from "../../api";

const CreateGoalModal = ({ close, refreshGoals }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const createGoal = async () => {
    try {
      const res = await axios.post("/savings/create", {
        name,
        targetAmount: Number(targetAmount)
      });

      refreshGoals();
      close();
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
        <button onClick={close} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default CreateGoalModal;
