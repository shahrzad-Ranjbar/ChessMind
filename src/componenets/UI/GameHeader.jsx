import React from "react";
import DifficultySelector from "../GameControls/DifficultySelector";
import GameInfo from "../GameControls/GameInfo";

const GameHeader = ({ difficulty, currentPlayer, onDifficultyChange }) => {
  const styles = {
    author: {
      fontSize: "1rem",
      color: "#888",
      marginTop: "5px",
      marginBottom: "20px",
      textAlign: "center",
      display: "block", // خیلی مهم
    },
  };

  return (
    <div className="game-header">
      <h1 className="game-title">♟️ شطرنج هوشمند 🧠</h1>
      <span style={styles.author}>شهرزاد رنجبر</span>
      <DifficultySelector
        currentDifficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />
      <GameInfo currentPlayer={currentPlayer} difficulty={difficulty} />
    </div>
  );
};

export default GameHeader;
