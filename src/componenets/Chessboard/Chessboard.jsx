import React, { useMemo } from "react";
import Square from "./Square";

const Chessboard = ({
  board,
  selectedSquare,
  possibleMoves,
  onSquareClick,
  chessEngine,
}) => {
  // اگر board هنوز مقداردهی نشده یا خالی است، رندر نکن
  if (!board || board.length === 0) {
    return <div className="chessboard">در حال بارگذاری...</div>;
  }

  const squares = useMemo(() => {
    const result = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isSelected =
          selectedSquare &&
          selectedSquare[0] === row &&
          selectedSquare[1] === col;

        const isPossibleMove = possibleMoves.some(
          ([r, c]) => r === row && c === col
        );

        // دسترسی امن به piece
        const piece = board?.[row]?.[col] || null;

        result.push(
          <Square
            key={`${row}-${col}`}
            row={row}
            col={col}
            piece={piece}
            isSelected={isSelected}
            isPossibleMove={isPossibleMove}
            onClick={onSquareClick}
            chessEngine={chessEngine}
          />
        );
      }
    }

    return result;
  }, [board, selectedSquare, possibleMoves, onSquareClick, chessEngine]);

  return <div className="chessboard">{squares}</div>;
};

export default Chessboard;
