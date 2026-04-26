import React, { useState } from "react";
import DepositToGoalModal from "./DepositToGoalModal";

const SavingsCard = ({ goal, refreshGoals }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);

  const percentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );

  const colors = ["#FF6B6B", "#4ECDC4", "#5567FF", "#FFA726"];
  const randomColor = colors[goal.name.length % colors.length];

  return (
    <div className="savings-card" style={{ borderLeft: `6px solid ${randomColor}` }}>
      <h3>{goal.name}</h3>

      {goal.isCompleted ? (
        <p className="completed-text">
          £{goal.targetAmount} — goal reached!
        </p>
      ) : (
        <>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${percentage}%`, background: randomColor }}
            />
          </div>

          <p>
            £{goal.currentAmount} / £{goal.targetAmount}
          </p>

          <button
            className="add-money-btn"
            onClick={() => setShowDepositModal(true)}
          >
            Add Money
          </button>
        </>
      )}

      {showDepositModal && (
        <DepositToGoalModal
          goalId={goal._id}
          close={() => setShowDepositModal(false)}
          refreshGoals={refreshGoals}
        />
      )}
    </div>
  );
  <button 
  className="delete-goal-btn"
  onClick={() => onDelete(goal._id)}
>
  Delete
</button>

};

export default SavingsCard;
