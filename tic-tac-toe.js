if (!window.TicTacToeGame) {
  window.TicTacToeGame = class TicTacToeGame {
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
    winningMessage = () => `Player ${this.currentPlayer} Wins!`;
    drawMessage = () => `Game Ended in a Draw!`;
    currentPlayerTurn = () => `Player ${this.currentPlayer}'s Turn`;

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
      if (this.gameState[clickedCellIndex] !== "" || !this.gameActive) return;
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
    }

    handleRestartGame() {
      this.init();
    }

    destroy() {
      console.log("Tic Tac Toe Destroyed!");
      this.cells.forEach((cell) =>
        cell.removeEventListener("click", this.boundCellClick)
      );
      this.restartButton.removeEventListener("click", this.boundRestartGame);
    }
  };
}

window.currentGameInstance = new window.TicTacToeGame();
