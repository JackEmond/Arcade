export class TicTacToeGame {
  constructor() {
    this.board = document.getElementById("board");
    this.cells = document.querySelectorAll("[data-cell-index]");
    this.gameStatus = document.getElementById("gameStatus");
    this.restartButton = document.getElementById("restartButton");

    this.winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    this.boundCellClick = this.handleCellClick.bind(this);
    this.boundRestartGame = this.handleRestartGame.bind(this);

    this.init();
  }

  // --- Messages ---
  winningMessage = () =>
    this.currentPlayer === "X" ? "You Win!" : "Computer Wins!";
  drawMessage = () => `Game Ended in a Draw!`;
  currentPlayerTurn = () =>
    this.currentPlayer === "X" ? "Your Turn" : "Computer's Turn";

  init() {
    this.gameActive = true;
    this.currentPlayer = "X";
    this.gameState = ["", "", "", "", "", "", "", "", ""];
    this.gameStatus.textContent = this.currentPlayerTurn();
    this.cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "win");
    });
    this.cells.forEach((cell) =>
      cell.addEventListener("click", this.boundCellClick)
    );
    this.restartButton.addEventListener("click", this.boundRestartGame);
  }

  handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(
      clickedCell.getAttribute("data-cell-index")
    );

    if (
      this.gameState[clickedCellIndex] !== "" ||
      !this.gameActive ||
      this.currentPlayer === "O"
    ) {
      return;
    }

    this.handleCellPlayed(clickedCell, clickedCellIndex);
    this.handleResultValidation();
  }

  handleCellPlayed(clickedCell, clickedCellIndex) {
    this.gameState[clickedCellIndex] = this.currentPlayer;
    clickedCell.textContent = this.currentPlayer;
    clickedCell.classList.add(this.currentPlayer.toLowerCase());
  }

  handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];
    for (const winCondition of this.winningConditions) {
      let a = this.gameState[winCondition[0]];
      let b = this.gameState[winCondition[1]];
      let c = this.gameState[winCondition[2]];
      if (a === "" || b === "" || c === "") continue;
      if (a === b && b === c) {
        roundWon = true;
        winningCombo = winCondition;
        break;
      }
    }
    if (roundWon) {
      this.gameStatus.textContent = this.winningMessage();
      this.gameActive = false;
      winningCombo.forEach((index) => this.cells[index].classList.add("win"));
      return;
    }
    if (!this.gameState.includes("")) {
      this.gameStatus.textContent = this.drawMessage();
      this.gameActive = false;
      return;
    }
    this.handlePlayerChange();
  }

  handlePlayerChange() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.gameStatus.textContent = this.currentPlayerTurn();

    if (this.currentPlayer === "O" && this.gameActive) {
      setTimeout(() => this.computerMove(), 500);
    }
  }

  computerMove() {
    const bestMove = this.minimax(this.gameState, "O").index;
    const cellToPlay = this.cells[bestMove];
    this.handleCellPlayed(cellToPlay, bestMove);
    this.handleResultValidation();
  }

  minimax(newGameState, player) {
    const availableSpots = newGameState
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);

    // Check for terminal states (win, lose, draw)
    if (this.checkWin(newGameState, "X")) {
      return { score: -10 };
    } else if (this.checkWin(newGameState, "O")) {
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
      const move = {};
      move.index = availableSpots[i];
      newGameState[availableSpots[i]] = player;

      if (player === "O") {
        const result = this.minimax(newGameState, "X");
        move.score = result.score;
      } else {
        const result = this.minimax(newGameState, "O");
        move.score = result.score;
      }

      newGameState[availableSpots[i]] = ""; // Undo the move
      moves.push(move);
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  checkWin(board, player) {
    for (const condition of this.winningConditions) {
      if (
        board[condition[0]] === player &&
        board[condition[1]] === player &&
        board[condition[2]] === player
      ) {
        return true;
      }
    }
    return false;
  }

  handleRestartGame() {
    this.init();
  }

  destroy() {
    this.cells.forEach((cell) =>
      cell.removeEventListener("click", this.boundCellClick)
    );
    this.restartButton.removeEventListener("click", this.boundRestartGame);
  }
}
