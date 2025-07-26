export class BoxjumpGame {
  constructor() {
    // --- DOM Elements ---
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.scoreElement = document.getElementById("score");
    this.restartButton = document.getElementById("restartButton");

    // --- Game Configuration ---
    this.playerWidth = 40;
    this.playerHeight = 40;
    this.playerColor = "#00ffff"; // Neon Cyan
    this.obstacleColor = "#ff00ff"; // Neon Magenta
    this.groundHeight = 50;
    this.groundColor = "#00ffff";

    // --- Game State ---
    this.player = {};
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.keys = {};
    this.gameSpeed = 4;
    this.obstacleTimer = 0;

    // --- Setup and Start ---
    this._setupEventListeners();
    this.init();
  }

  // --- Game Initialization ---
  init() {
    // Reset player state
    this.player = {
      x: 50,
      y: this.canvas.height - this.groundHeight - this.playerHeight,
      width: this.playerWidth,
      height: this.playerHeight,
      dy: 0,
      gravity: 0.7,
      jumpPower: -15,
      onGround: true,
    };

    // Reset game state
    this.obstacles = [];
    this.score = 0;
    this.gameSpeed = 4;
    this.gameOver = false;
    this.obstacleTimer = 150; // Initial delay before first obstacle
    this.scoreElement.textContent = "Score: 0";
    this.restartButton.style.display = "none";

    // Start the game loop
    this.gameLoop();
  }

  // --- Obstacle Generation ---
  createObstacle() {
    const minHeight = 30;
    const maxHeight = 80;
    const minWidth = 30;
    const maxWidth = 60;

    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const width = Math.random() * (maxWidth - minWidth) + minWidth;

    this.obstacles.push({
      x: this.canvas.width,
      y: this.canvas.height - this.groundHeight - height,
      width: width,
      height: height,
      passed: false,
    });
  }

  // --- Event Listeners Setup ---
  _setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        this.keys["jump"] = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        this.keys["jump"] = false;
      }
    });

    this.restartButton.addEventListener("click", () => this.init());
  }

  // --- Game Logic ---
  update() {
    if (this.gameOver) return;

    // Player jumping
    if (this.keys["jump"] && this.player.onGround) {
      this.player.dy = this.player.jumpPower;
      this.player.onGround = false;
    }

    // Apply gravity
    this.player.dy += this.player.gravity;
    this.player.y += this.player.dy;
    this.player.onGround = false;

    // Ground collision
    if (
      this.player.y + this.player.height >=
      this.canvas.height - this.groundHeight
    ) {
      this.player.y =
        this.canvas.height - this.groundHeight - this.player.height;
      this.player.dy = 0;
      this.player.onGround = true;
    }

    // Obstacle spawning
    this.obstacleTimer--;
    if (this.obstacleTimer <= 0) {
      this.createObstacle();
      // Reset timer for next obstacle, make it random
      this.obstacleTimer =
        Math.floor(Math.random() * 100) + 80 - this.gameSpeed * 4;
    }

    // Move and check obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.x -= this.gameSpeed;

      // Collision detection
      if (
        this.player.x < obstacle.x + obstacle.width &&
        this.player.x + this.player.width > obstacle.x &&
        this.player.y < obstacle.y + obstacle.height &&
        this.player.y + this.player.height > obstacle.y
      ) {
        this.gameOver = true;
        this.restartButton.style.display = "block";
      }

      // Update score
      if (!obstacle.passed && obstacle.x + obstacle.width < this.player.x) {
        obstacle.passed = true;
        this.score++;
        this.scoreElement.textContent = `Score: ${this.score}`;
        // Increase speed slightly with score
        if (this.score % 5 === 0) {
          this.gameSpeed += 0.2;
        }
      }
    });

    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter((o) => o.x + o.width > 0);
  }

  // --- Drawing ---
  draw() {
    // Clear canvas with a dark background
    this.ctx.fillStyle = "#0a0a0a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the ground
    this.ctx.fillStyle = this.groundColor;
    this.ctx.shadowColor = this.groundColor;
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(
      0,
      this.canvas.height - this.groundHeight,
      this.canvas.width,
      this.groundHeight
    );

    // Draw Player with glow
    this.ctx.fillStyle = this.playerColor;
    this.ctx.shadowColor = this.playerColor;
    this.ctx.shadowBlur = 15;
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // Draw Obstacles with glow
    this.ctx.fillStyle = this.obstacleColor;
    this.ctx.shadowColor = this.obstacleColor;
    this.ctx.shadowBlur = 10;
    this.obstacles.forEach((obstacle) => {
      this.ctx.fillRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    });

    // Reset shadow for UI elements
    this.ctx.shadowBlur = 0;

    // Draw Game Over screen
    if (this.gameOver) {
      this.drawGameOver();
    }
  }

  drawGameOver() {
    this.ctx.textAlign = "center";
    this.ctx.font = "40px 'Press Start 2P'";

    // Create the glowing text effect
    this.ctx.fillStyle = "#ff0000"; // Neon Red
    this.ctx.shadowColor = "#ff0000";
    this.ctx.shadowBlur = 20;
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20
    );

    // Draw a second pass for a stronger glow
    this.ctx.shadowBlur = 10;
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20
    );

    // Reset shadow
    this.ctx.shadowBlur = 0;
  }

  // --- Main Game Loop ---
  gameLoop() {
    this.update();
    this.draw();
    if (!this.gameOver) {
      // Use .bind(this) to maintain the correct context for the next frame
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }
}
