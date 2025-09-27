export class ChessEngine {
    constructor() {
        this.pieces = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        
        this.pieceValues = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100
        };
    }

    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    isWhitePiece(piece) {
        return piece && piece === piece.toUpperCase();
    }

    isBlackPiece(piece) {
        return piece && piece === piece.toLowerCase();
    }

    isValidMove(board, fromRow, fromCol, toRow, toCol) {
        if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
        
        const piece = board[fromRow][fromCol];
        const targetPiece = board[toRow][toCol];
        
        if (!piece) return false;
        
        if (targetPiece && 
            ((this.isWhitePiece(piece) && this.isWhitePiece(targetPiece)) ||
             (this.isBlackPiece(piece) && this.isBlackPiece(targetPiece)))) {
            return false;
        }

        const pieceType = piece.toLowerCase();
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        switch (pieceType) {
            case 'p':
                return this.isValidPawnMove(board, fromRow, fromCol, toRow, toCol, piece);
            case 'r':
                return this.isValidRookMove(board, fromRow, fromCol, toRow, toCol);
            case 'n':
                return this.isValidKnightMove(rowDiff, colDiff);
            case 'b':
                return this.isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
            case 'q':
                return this.isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
            case 'k':
                return this.isValidKingMove(rowDiff, colDiff);
            default:
                return false;
        }
    }

    isValidPawnMove(board, fromRow, fromCol, toRow, toCol, piece) {
        const isWhite = this.isWhitePiece(piece);
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        if (colDiff === 0) {
            if (rowDiff === direction && !board[toRow][toCol]) return true;
            if (fromRow === startRow && rowDiff === 2 * direction && !board[toRow][toCol]) return true;
        } else if (colDiff === 1 && rowDiff === direction && board[toRow][toCol]) {
            return true;
        }

        return false;
    }

    isValidRookMove(board, fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol) return false;
        return this.isPathClear(board, fromRow, fromCol, toRow, toCol);
    }

    isValidKnightMove(rowDiff, colDiff) {
        return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
               (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
    }

    isValidBishopMove(board, fromRow, fromCol, toRow, toCol) {
        if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
        return this.isPathClear(board, fromRow, fromCol, toRow, toCol);
    }

    isValidQueenMove(board, fromRow, fromCol, toRow, toCol) {
        return this.isValidRookMove(board, fromRow, fromCol, toRow, toCol) ||
               this.isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
    }

    isValidKingMove(rowDiff, colDiff) {
        return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    }

    isPathClear(board, fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }

    getPossibleMoves(board, row, col) {
        const moves = [];
        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                if (this.isValidMove(board, row, col, toRow, toCol)) {
                    moves.push([toRow, toCol]);
                }
            }
        }
        return moves;
    }

    getAllMoves(board, isBlack) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && ((isBlack && this.isBlackPiece(piece)) || (!isBlack && this.isWhitePiece(piece)))) {
                    const possibleMoves = this.getPossibleMoves(board, row, col);
                    for (const [toRow, toCol] of possibleMoves) {
                        moves.push({from: [row, col], to: [toRow, toCol]});
                    }
                }
            }
        }
        return moves;
    }

    evaluateBoard(board) {
        let score = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const value = this.pieceValues[piece.toLowerCase()];
                    score += this.isWhitePiece(piece) ? -value : value;
                }
            }
        }
        return score;
    }

    minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
        if (depth === 0) {
            return this.evaluateBoard(board);
        }

        const moves = this.getAllMoves(board, isMaximizing);
        
        if (moves.length === 0) {
            return isMaximizing ? -1000 : 1000;
        }

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const [fromRow, fromCol] = move.from;
                const [toRow, toCol] = move.to;
                
                const newBoard = board.map(row => [...row]);
                newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
                newBoard[fromRow][fromCol] = null;
                
                const evaluation = this.minimax(newBoard, depth - 1, false, alpha, beta);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const [fromRow, fromCol] = move.from;
                const [toRow, toCol] = move.to;
                
                const newBoard = board.map(row => [...row]);
                newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
                newBoard[fromRow][fromCol] = null;
                
                const evaluation = this.minimax(newBoard, depth - 1, true, alpha, beta);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    getBestMove(board, difficulty) {
        const depth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
        const moves = this.getAllMoves(board, true);
        
        if (moves.length === 0) return null;

        if (difficulty === 'easy' && Math.random() < 0.3) {
            return moves[Math.floor(Math.random() * moves.length)];
        }

        let bestMove = null;
        let bestValue = -Infinity;

        for (const move of moves) {
            const [fromRow, fromCol] = move.from;
            const [toRow, toCol] = move.to;
            
            const newBoard = board.map(row => [...row]);
            newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
            newBoard[fromRow][fromCol] = null;
            
            const moveValue = this.minimax(newBoard, depth - 1, false);
            
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
        }

        return bestMove;
    }

    isGameOver(board) {
        let whiteKing = false, blackKing = false;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece === 'K') whiteKing = true;
                if (piece === 'k') blackKing = true;
            }
        }
        return !whiteKing || !blackKing;
    }
}