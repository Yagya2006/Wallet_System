import "./SavingsPage.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SavingsCard from "../components/savings/SavingsCard";
import CreateGoalModal from "../components/savings/CreateGoalModal";

const SavingsPage = () => {
  const [goals, setGoals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadGoals = async () => {
    try {
const res = await axios.get(
  "http://localhost:5000/api/savings/goals",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      setGoals(res.data.goals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div className="savings-page">
      <div className="header">
        <h2>Savings Goals</h2>
        <button onClick={() => setShowCreateModal(true)}>
          + Create Goal
        </button>
      </div>

      <div className="goals-container">
        {goals.map(goal => (
          <SavingsCard key={goal._id} goal={goal} refreshGoals={loadGoals} />
        ))}
      </div>

      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          refreshGoals={loadGoals}
        />
      )}
    </div>
  );
};

export default SavingsPage;
