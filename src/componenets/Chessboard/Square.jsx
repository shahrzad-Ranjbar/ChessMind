import React, { useCallback } from "react";
import ChessPiece from "./ChessPiece";

const Square = ({
  row,
  col,
  piece,
  isSelected,
  isPossibleMove,
  onClick,
  chessEngine,
}) => {
  const isLight = (row + col) % 2 === 0;

  const handleClick = useCallback(() => {
    onClick(row, col);
  }, [onClick, row, col]);

  return (
    <div
      className={`square ${isLight ? "light" : "dark"} ${
        isSelected ? "selected" : ""
      } ${isPossibleMove ? "possible-move" : ""}`}
      onClick={handleClick}
    >
      {piece && <ChessPiece piece={piece} chessEngine={chessEngine} />}
    </div>
  );
};

export default Square;
