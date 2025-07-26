export class HangmanGame {
  constructor() {
    // --- DOM Elements ---
    this.wordDisplay = document.getElementById("wordDisplay");
    this.keyboardContainer = document.getElementById("keyboard");
    this.hangmanParts = document.querySelectorAll(".hangman-part");
    this.gameContent = document.getElementById("gameContent");
    this.winScreen = document.getElementById("winScreen");
    this.loseScreen = document.getElementById("loseScreen");
    this.winRevealWord = document.getElementById("winRevealWord");
    this.loseRevealWord = document.getElementById("loseRevealWord");
    this.winPlayAgainButton = document.getElementById("winPlayAgainButton");
    this.losePlayAgainButton = document.getElementById("losePlayAgainButton");

    // --- Game Data ---
    this.words = [
      "JAVASCRIPT",
      "INTERFACE",
      "ARCADE",
      "NEON",
      "STYLESHEET",
      "DEVELOPER",
      "ALGORITHM",
    ];
    this.maxWrongGuesses = 6;

    // Bind 'this' to event handlers
    this.boundStartGame = this.startGame.bind(this);
    this.boundHandleGuess = this.handleGuess.bind(this);

    // Initial Game Start
    this.startGame();
  }

  /**
   * Starts a new game or restarts the current one.
   */
  startGame() {
    // Reset state
    this.correctLetters = [];
    this.wrongGuesses = 0;
    this.selectedWord =
      this.words[Math.floor(Math.random() * this.words.length)];

    // Reset UI
    this.displayWord();
    this.createKeyboard();
    this.updateFigure();
    this.gameContent.style.display = "block";
    this.winScreen.style.display = "none";
    this.loseScreen.style.display = "none";

    // Ensure the event listener is attached
    this.winPlayAgainButton.removeEventListener("click", this.boundStartGame); // remove previous before adding
    this.winPlayAgainButton.addEventListener("click", this.boundStartGame);
    this.losePlayAgainButton.removeEventListener("click", this.boundStartGame); // remove previous before adding
    this.losePlayAgainButton.addEventListener("click", this.boundStartGame);
  }

  /**
   * Renders the word display with underscores and correct letters.
   */
  displayWord() {
    this.wordDisplay.innerHTML = this.selectedWord
      .split("")
      .map(
        (letter) =>
          `<div class="letter">${
            this.correctLetters.includes(letter) ? letter : ""
          }</div>`
      )
      .join("");

    // Check for win
    const innerWord = this.wordDisplay.innerText.replace(/\n/g, "");
    if (innerWord === this.selectedWord) {
      this.showWinScreen();
    }
  }

  /**
   * Creates the on-screen keyboard.
   */
  createKeyboard() {
    this.keyboardContainer.innerHTML = ""; // Clear previous keyboard
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter) => {
      const key = document.createElement("button");
      key.className = "key";
      key.textContent = letter;
      key.addEventListener("click", () => this.boundHandleGuess(letter, key));
      this.keyboardContainer.appendChild(key);
    });
  }

  /**
   * Handles a player's letter guess.
   * @param {string} letter - The letter that was guessed.
   * @param {HTMLElement} keyElement - The button element that was clicked.
   */
  handleGuess(letter, keyElement) {
    // Disable the clicked key
    keyElement.disabled = true;

    if (this.selectedWord.includes(letter)) {
      // Correct guess
      this.correctLetters.push(letter);
      this.displayWord();
    } else {
      // Wrong guess
      this.wrongGuesses++;
      this.updateFigure();
    }
  }

  /**
   * Updates the hangman drawing based on the number of wrong guesses.
   */
  updateFigure() {
    this.hangmanParts.forEach((part, index) => {
      part.classList.toggle("visible", index < this.wrongGuesses);
    });

    // Check for loss
    if (this.wrongGuesses >= this.maxWrongGuesses) {
      this.showLoseScreen();
    }
  }

  /**
   * Shows the win screen.
   */
  showWinScreen() {
    this.gameContent.style.display = "none";
    this.winScreen.style.display = "block";
    this.winRevealWord.textContent = `The word was: ${this.selectedWord}`;
  }

  /**
   * Shows the lose screen.
   */
  showLoseScreen() {
    this.gameContent.style.display = "none";
    this.loseScreen.style.display = "block";
    this.loseRevealWord.textContent = `The word was: ${this.selectedWord}`;
  }

  /**
   * Cleans up event listeners when the game is removed.
   */
  destroy() {
    console.log("Hangman Destroyed!");
    this.winPlayAgainButton.removeEventListener("click", this.boundStartGame);
    this.losePlayAgainButton.removeEventListener("click", this.boundStartGame);
  }
}
