import React from "react";

const GameInfo = ({ currentPlayer, difficulty }) => {
  const difficultyNames = {
    easy: "ساده",
    medium: "متوسط",
    hard: "سخت",
  };

  const playerName =
    currentPlayer === "white" ? "سفید (شما)" : "سیاه (هوش مصنوعی)";

  return (
    <div className="game-info">
      <span>
        نوبت: <span>{playerName}</span>
      </span>
      <span>
        سطح: <span>{difficultyNames[difficulty]}</span>
      </span>
    </div>
  );
};

export default GameInfo;
