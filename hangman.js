// --- DOM Elements ---
const wordDisplay = document.getElementById("wordDisplay");
const keyboardContainer = document.getElementById("keyboard");
const hangmanParts = document.querySelectorAll(".hangman-part");
const popupContainer = document.getElementById("popupContainer");
const finalMessage = document.getElementById("finalMessage");
const finalMessageRevealWord = document.getElementById(
  "finalMessageRevealWord"
);
const playAgainButton = document.getElementById("playAgainButton");

// --- Game Data & State ---
const words = [
  "JAVASCRIPT",
  "INTERFACE",
  "ARCADE",
  "NEON",
  "STYLESHEET",
  "DEVELOPER",
  "ALGORITHM",
];
let selectedWord = "";
let correctLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = 6;

// --- Functions ---

/**
 * Starts a new game or restarts the current one.
 */
function startGame() {
  // Reset state
  correctLetters = [];
  wrongGuesses = 0;

  // Select a new word
  selectedWord = words[Math.floor(Math.random() * words.length)];

  // Reset UI
  displayWord();
  createKeyboard();
  updateFigure();
  popupContainer.classList.remove("visible");
}

/**
 * Renders the word display with underscores and correct letters.
 */
function displayWord() {
  wordDisplay.innerHTML = selectedWord
    .split("")
    .map(
      (letter) =>
        `<div class="letter">${
          correctLetters.includes(letter) ? letter : ""
        }</div>`
    )
    .join("");

  // Check for win
  const innerWord = wordDisplay.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    showPopup(true);
  }
}

/**
 * Creates the on-screen keyboard.
 */
function createKeyboard() {
  keyboardContainer.innerHTML = ""; // Clear previous keyboard
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter) => {
    const key = document.createElement("button");
    key.className = "key";
    key.textContent = letter;
    key.addEventListener("click", () => handleGuess(letter));
    keyboardContainer.appendChild(key);
  });
}

/**
 * Handles a player's letter guess.
 * @param {string} letter - The letter that was guessed.
 */
function handleGuess(letter) {
  // Disable the clicked key
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    if (key.textContent === letter) {
      key.disabled = true;
    }
  });

  if (selectedWord.includes(letter)) {
    // Correct guess
    correctLetters.push(letter);
    displayWord();
  } else {
    // Wrong guess
    wrongGuesses++;
    updateFigure();
  }
}

/**
 * Updates the hangman drawing based on the number of wrong guesses.
 */
function updateFigure() {
  hangmanParts.forEach((part, index) => {
    part.classList.toggle("visible", index < wrongGuesses);
  });

  // Check for loss
  if (wrongGuesses >= maxWrongGuesses) {
    showPopup(false);
  }
}

/**
 * Shows the final win/loss popup message.
 * @param {boolean} isWin - Whether the player won or lost.
 */
function showPopup(isWin) {
  finalMessage.textContent = isWin ? "YOU WIN!" : "GAME OVER";
  finalMessageRevealWord.textContent = `The word was: ${selectedWord}`;
  popupContainer.classList.add("visible");
}

// --- Event Listeners ---
playAgainButton.addEventListener("click", startGame);

// --- Initial Game Start ---
startGame();
