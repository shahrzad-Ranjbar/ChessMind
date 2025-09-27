import React from "react";

const ChessPiece = ({ piece, chessEngine }) => {
  const pieceColor = chessEngine.isWhitePiece(piece) ? "white" : "black";

  return (
    <div className={`piece ${pieceColor}`}>{chessEngine.pieces[piece]}</div>
  );
};

export default ChessPiece;
