import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChessEngine } from "../engine/ChessEngine";
import LoadingScreen from "./UI/LoadingScreen";
import GameHeader from "./UI/GameHeader";
import Chessboard from "./Chessboard/Chessboard";
import GameControls from "./GameControls/GameControls";
import StatusMessage from "./UI/StatusMessage";

const ChessGame = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState(
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [gameHistory, setGameHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "بازی شروع شد! نوبت شماست."
  );
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Chess engine instance
  const chessEngine = useMemo(() => new ChessEngine(), []);

  // Initialize game
  useEffect(() => {
    const initialBoard = chessEngine.initializeBoard();
    setBoard(initialBoard);

    // نمایش LoadingScreen حداقل نیم ثانیه
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, [chessEngine]);

  // Make a move
  const makeMove = useCallback(
    (fromRow, fromCol, toRow, toCol) => {
      const newBoard = board.map((row) => [...row]);
      const piece = newBoard[fromRow][fromCol];
      const capturedPiece = newBoard[toRow][toCol];

      setGameHistory((prev) => [
        ...prev,
        {
          from: [fromRow, fromCol],
          to: [toRow, toCol],
          piece,
          captured: capturedPiece,
          board: board.map((r) => [...r]),
        },
      ]);

      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setSelectedSquare(null);
      setPossibleMoves([]);

      return newBoard;
    },
    [board, currentPlayer]
  );

  // AI move logic
  const makeAIMove = useCallback(async () => {
    setIsAIThinking(true);
    setStatusMessage("هوش مصنوعی در حال فکر کردن...");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const bestMove = chessEngine.getBestMove(board, difficulty);
    if (bestMove) {
      const [fromRow, fromCol] = bestMove.from;
      const [toRow, toCol] = bestMove.to;
      const newBoard = makeMove(fromRow, fromCol, toRow, toCol);

      if (chessEngine.isGameOver(newBoard)) {
        setStatusMessage("بازی تمام شد! هوش مصنوعی برنده شد!");
        setGameOver(true);
      } else {
        setStatusMessage("نوبت شماست!");
      }
    }

    setIsAIThinking(false);
  }, [board, difficulty, makeMove, chessEngine]);

  // Trigger AI move
  useEffect(() => {
    if (currentPlayer === "black" && !gameOver && board.length > 0) {
      makeAIMove();
    }
  }, [currentPlayer, gameOver, board, makeAIMove]);

  // Handle square clicks
  const handleSquareClick = useCallback(
    (row, col) => {
      if (gameOver || currentPlayer === "black" || isAIThinking) return;

      if (selectedSquare) {
        const [selectedRow, selectedCol] = selectedSquare;

        if (row === selectedRow && col === selectedCol) {
          setSelectedSquare(null);
          setPossibleMoves([]);
        } else if (
          chessEngine.isValidMove(board, selectedRow, selectedCol, row, col)
        ) {
          const newBoard = makeMove(selectedRow, selectedCol, row, col);
          if (chessEngine.isGameOver(newBoard)) {
            setStatusMessage("بازی تمام شد! شما برنده شدید!");
            setGameOver(true);
          }
        } else {
          const piece = board[row][col];
          if (piece && chessEngine.isWhitePiece(piece)) {
            setSelectedSquare([row, col]);
            setPossibleMoves(chessEngine.getPossibleMoves(board, row, col));
          }
        }
      } else {
        const piece = board[row][col];
        if (piece && chessEngine.isWhitePiece(piece)) {
          setSelectedSquare([row, col]);
          setPossibleMoves(chessEngine.getPossibleMoves(board, row, col));
        }
      }
    },
    [
      gameOver,
      currentPlayer,
      isAIThinking,
      selectedSquare,
      board,
      chessEngine,
      makeMove,
    ]
  );

  // New game handler
  const handleNewGame = useCallback(() => {
    const initialBoard = chessEngine.initializeBoard();
    setBoard(initialBoard);
    setCurrentPlayer("white");
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameHistory([]);
    setGameOver(false);
    setStatusMessage("بازی جدید شروع شد! نوبت شماست.");
    setIsAIThinking(false);
  }, [chessEngine]);

  // Undo move handler
  const handleUndoMove = useCallback(() => {
    if (gameHistory.length === 0) return;

    let newHistory = [...gameHistory];
    let lastMove = newHistory.pop();

    if (currentPlayer === "white" && newHistory.length > 0) {
      lastMove = newHistory.pop();
    }

    setBoard(lastMove.board);
    setCurrentPlayer("white");
    setGameHistory(newHistory);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setStatusMessage("نوبت شماست!");
    setGameOver(false);
  }, [gameHistory, currentPlayer]);

  // Difficulty change handler
  const handleDifficultyChange = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  return (
    <>
      <LoadingScreen isVisible={isLoading} />

      {!isLoading && (
        <div className="game-container">
          <GameHeader
            difficulty={difficulty}
            currentPlayer={currentPlayer}
            onDifficultyChange={handleDifficultyChange}
          />

          <Chessboard
            board={board}
            selectedSquare={selectedSquare}
            possibleMoves={possibleMoves}
            onSquareClick={handleSquareClick}
            chessEngine={chessEngine}
          />

          <GameControls onNewGame={handleNewGame} onUndoMove={handleUndoMove} />

          <StatusMessage message={statusMessage} isAIThinking={isAIThinking} />
        </div>
      )}
    </>
  );
};

export default ChessGame;
