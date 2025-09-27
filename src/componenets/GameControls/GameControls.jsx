import React from "react";

const GameControls = ({ onNewGame, onUndoMove }) => {
  return (
    <div className="game-controls">
      <button className="control-btn" onClick={onNewGame}>
        بازی جدید
      </button>
      <button className="control-btn" onClick={onUndoMove}>
        برگشت
      </button>
    </div>
  );
};
export default GameControls;
