import React from "react";

const LoadingScreen = ({ isVisible }) => {
  const loadingPieces = ["♔", "♕", "♖", "♗", "♘", "♙"];

  return (
    <div className={`loading-screen ${!isVisible ? "hidden" : ""}`}>
      <div className="loading-title">شطرنج هوشمند</div>
      <div className="loading-pieces">
        {loadingPieces.map((piece, index) => (
          <div key={index} className="loading-piece">
            {piece}
          </div>
        ))}
      </div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
