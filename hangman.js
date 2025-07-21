export class HangmanGame {
  constructor() {
    // --- DOM Elements ---
    this.wordDisplay = document.getElementById("wordDisplay");
    this.keyboardContainer = document.getElementById("keyboard");
    this.hangmanParts = document.querySelectorAll(".hangman-part");
    this.popupContainer = document.getElementById("popupContainer");
    this.finalMessage = document.getElementById("finalMessage");
    this.finalMessageRevealWord = document.getElementById(
      "finalMessageRevealWord"
    );
    this.playAgainButton = document.getElementById("playAgainButton");

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
    this.popupContainer.classList.remove("visible");

    // Ensure the event listener is attached
    this.playAgainButton.removeEventListener("click", this.boundStartGame); // remove previous before adding
    this.playAgainButton.addEventListener("click", this.boundStartGame);
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
      this.showPopup(true);
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
      this.showPopup(false);
    }
  }

  /**
   * Shows the final win/loss popup message.
   * @param {boolean} isWin - Whether the player won or lost.
   */
  showPopup(isWin) {
    this.finalMessage.textContent = isWin ? "YOU WIN!" : "GAME OVER";
    this.finalMessageRevealWord.textContent = `The word was: ${this.selectedWord}`;
    this.popupContainer.classList.add("visible");
  }

  /**
   * Cleans up event listeners when the game is removed.
   */
  destroy() {
    console.log("Hangman Destroyed!");
    this.playAgainButton.removeEventListener("click", this.boundStartGame);
    // Note: Keyboard listeners are on elements that get removed anyway,
    // so cleaning them up is less critical, but removing the playAgainButton
    // listener is important.
  }
}
