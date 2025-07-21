let currentGameInstance = null;

async function loadScreen(pageId) {
  const screen = document.getElementById("screen");
  console.log(`Loading screen for: ${pageId}`);

  // --- CLEAN UP THE PREVIOUS GAME ---
  if (currentGameInstance) {
    if (typeof currentGameInstance.destroy === "function") {
      currentGameInstance.destroy();
    }
    currentGameInstance = null;
  }

  // --- LOAD THE NEW HTML CONTENT ---
  try {
    const response = await fetch(`${pageId}.html`);
    if (!response.ok) throw new Error("Network response was not ok");
    screen.innerHTML = await response.text();
  } catch (error) {
    console.error("Failed to load page:", error);
    screen.innerHTML = `<p>Error loading content. Please try again.</p>`;
  }
}

/**
 * Loads pages that ARE games by loading the HTML and then dynamically
 * importing the corresponding game module.
 */
async function loadGame(gameId) {
  // First, load the screen and clean up the old game instance
  await loadScreen(gameId);

  try {
    // Dynamically import the game module using the gameId
    const gameModule = await import(`./${gameId}.js`);

    // The class name must be consistent. We can create a mapping
    const gameClassName = toPascalCase(gameId) + "Game";

    if (gameModule[gameClassName]) {
      currentGameInstance = new gameModule[gameClassName]();
    } else {
      console.error(`Class ${gameClassName} not found in module ${gameId}.js`);
    }
  } catch (error) {
    console.error(`Failed to load game script for ${gameId}:`, error);
  }
}

// Helper function to convert 'tic-tac-toe' to 'TicTacToe'
function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Make functions available to be called from the HTML (e.g., onclick)
window.loadGame = loadGame;
window.loadScreen = loadScreen;
