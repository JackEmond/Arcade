// --- DOM Elements ---
const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell-index]");
const gameStatus = document.getElementById("gameStatus");
const restartButton = document.getElementById("restartButton");

// --- Game State Variables ---
let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

// --- Winning Combinations ---
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// --- Messages ---
const winningMessage = () => `Player ${currentPlayer} Wins!`;
const drawMessage = () => `Game Ended in a Draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s Turn`;

// --- Functions ---

/**
 * Handles a click on a cell.
 * @param {MouseEvent} e - The click event.
 */
function handleCellClick(e) {
  const clickedCell = e.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  // If the cell is already played or the game is over, ignore the click
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  // Process the move
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

/**
 * Updates the game state and UI for a played cell.
 * @param {HTMLElement} clickedCell - The cell element that was clicked.
 * @param {number} clickedCellIndex - The index of the clicked cell.
 */
function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());
}

/**
 * Checks if the game has been won, drawn, or should continue.
 */
function handleResultValidation() {
  let roundWon = false;
  let winningCombo = [];
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningCombo = winCondition;
      break;
    }
  }

  if (roundWon) {
    gameStatus.textContent = winningMessage();
    gameActive = false;
    // Highlight the winning cells
    winningCombo.forEach((index) => {
      cells[index].classList.add("win");
    });
    return;
  }

  // Check for a draw
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    gameStatus.textContent = drawMessage();
    gameActive = false;
    return;
  }

  // If no win or draw, switch the player
  handlePlayerChange();
}

/**
 * Switches the current player and updates the status display.
 */
function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameStatus.textContent = currentPlayerTurn();
}

/**
 * Resets the game to its initial state.
 */
function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameStatus.textContent = currentPlayerTurn();
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "win");
  });
}

// --- Event Listeners ---
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", handleRestartGame);

// --- Initial Setup ---
gameStatus.textContent = currentPlayerTurn();
