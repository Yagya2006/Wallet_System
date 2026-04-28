import React, { useEffect, useState } from "react";
import axios from "axios";
import SavingsCard from "./SavingsCard";

const SavingsPreview = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load goals from backend
  const loadGoals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/savings/goals",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setGoals(response.data.goals || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Delete goal
  const deleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/savings/delete/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      loadGoals(); // refresh UI
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error deleting goal");
    }
  };

    useEffect(() => {
    loadGoals();
  }, []);

  if (loading) return <p>Loading goals...</p>;

  return (
    <div className="savings-preview">
      <h3 className="savings-title">Savings Goals</h3>

      {goals.length === 0 ? (
        <p>No active goals yet.</p>
      ) : (
        goals.map((goal) => (
          <SavingsCard
            key={goal._id}
            goal={goal}
            onDelete={deleteGoal}
            refreshGoals={loadGoals}
          />
        ))
      )}
    </div>
  );
};

export default SavingsPreview;
