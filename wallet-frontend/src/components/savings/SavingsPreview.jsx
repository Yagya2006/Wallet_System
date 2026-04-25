import React, { useEffect, useState } from "react";
import axios from "../../api";
import SavingsCard from "./SavingsCard";

const SavingsPreview = () => {
  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    try {
      const res = await axios.get("/savings/goals");
      const activeGoals = res.data.goals.filter(g => !g.isCompleted);
      setGoals(activeGoals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div className="savings-preview">
      <div className="preview-header">
        <h3>Savings Goals</h3>
        <a href="/savings" className="view-all">View All</a>
      </div>

      {goals.length === 0 ? (
        <p>No active goals yet.</p>
      ) : (
        <div className="preview-goals">
          {goals.map(goal => (
            <SavingsCard key={goal._id} goal={goal} refreshGoals={loadGoals} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavingsPreview;
