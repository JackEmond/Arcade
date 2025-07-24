export class RockPaperScissorsGame {
  constructor() {
    // --- DOM Elements ---
    this.playerScoreEl = document.getElementById("playerScore");
    this.computerScoreEl = document.getElementById("computerScore");
    this.playerChoiceDisplay = document.getElementById("playerChoiceDisplay");
    this.computerChoiceDisplay = document.getElementById(
      "computerChoiceDisplay"
    );
    this.resultMessage = document.getElementById("resultMessage");
    this.choiceButtons = document.querySelectorAll(".choice-btn");

    // --- Game State ---
    this.playerScore = 0;
    this.computerScore = 0;
    this.choices = ["rock", "paper", "scissors"];
    this.choiceEmojis = {
      rock: "<img src='images/rock.png' />",
      paper: "<img src='images/paper.png' />",
      scissors: "<img src='images/scissors.png' />",
    };

    // Bind the 'this' context for the event handler
    this.boundHandlePlayerChoice = this.handlePlayerChoice.bind(this);

    // Add initial event listeners
    this.choiceButtons.forEach((button) =>
      button.addEventListener("click", this.boundHandlePlayerChoice)
    );

    console.log("Rock Paper Scissors Initialized!");
  }

  /**
   * Handles the player's choice selection.
   * @param {Event} e - The click event from the button.
   */
  handlePlayerChoice(e) {
    const playerChoice = e.currentTarget.dataset.choice;
    const computerChoice = this.getComputerChoice();

    this.displayChoices(playerChoice, computerChoice);

    const winner = this.determineWinner(playerChoice, computerChoice);
    this.updateScore(winner);
    this.displayResult(winner, playerChoice, computerChoice);
  }

  /**
   * Generates a random choice for the computer.
   * @returns {string} The computer's choice ('rock', 'paper', or 'scissors').
   */
  getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * this.choices.length);
    return this.choices[randomIndex];
  }

  /**
   * Displays the player and computer choices on the screen.
   */
  displayChoices(player, computer) {
    this.playerChoiceDisplay.innerHTML = this.choiceEmojis[player];
    this.computerChoiceDisplay.innerHTML = this.choiceEmojis[computer];
  }

  /**
   * Determines the winner of the round.
   * @param {string} player - The player's choice.
   * @param {string} computer - The computer's choice.
   * @returns {string} 'player', 'computer', or 'draw'.
   */
  determineWinner(player, computer) {
    if (player === computer) {
      return "draw";
    }
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "scissors" && computer === "paper") ||
      (player === "paper" && computer === "rock")
    ) {
      return "player";
    }
    return "computer";
  }

  /**
   * Updates the score based on the winner.
   * @param {string} winner - The winner of the round.
   */
  updateScore(winner) {
    if (winner === "player") {
      this.playerScore++;
      this.playerScoreEl.textContent = this.playerScore;
    } else if (winner === "computer") {
      this.computerScore++;
      this.computerScoreEl.textContent = this.computerScore;
    }
  }

  /**
   * Displays the result message and applies glow effects.
   */
  displayResult(winner, player, computer) {
    this.playerChoiceDisplay.style.borderColor = "#444";
    this.computerChoiceDisplay.style.borderColor = "#444";
    this.resultMessage.style.color = "#fff";

    if (winner === "player") {
      this.resultMessage.textContent = `${player.toUpperCase()} beats ${computer.toUpperCase()}. YOU WIN!`;
      this.resultMessage.style.color = "var(--glow-color-win)";
      this.playerChoiceDisplay.style.borderColor = "var(--glow-color-win)";
    } else if (winner === "computer") {
      this.resultMessage.textContent = `${computer.toUpperCase()} beats ${player.toUpperCase()}. CPU WINS!`;
      this.resultMessage.style.color = "var(--glow-color-lose)";
      this.computerChoiceDisplay.style.borderColor = "var(--glow-color-lose)";
    } else {
      this.resultMessage.textContent = "IT'S A DRAW!";
    }
  }

  /**
   * Cleans up event listeners when the game is removed.
   */
  destroy() {
    console.log("Rock Paper Scissors Destroyed!");
    this.choiceButtons.forEach((button) =>
      button.removeEventListener("click", this.boundHandlePlayerChoice)
    );
  }
}
