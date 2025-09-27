import React from "react";

const DifficultySelector = ({ currentDifficulty, onDifficultyChange }) => {
  const difficulties = [
    { key: "easy", label: "ساده" },
    { key: "medium", label: "متوسط" },
    { key: "hard", label: "سخت" },
  ];

  return (
    <div className="difficulty-selector">
      {difficulties.map(({ key, label }) => (
        <button
          key={key}
          className={`difficulty-btn ${
            currentDifficulty === key ? "active" : ""
          }`}
          onClick={() => onDifficultyChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
