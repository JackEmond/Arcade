let currentGameScript = null;

async function loadScreen(pageId) {
  const screen = document.getElementById("screen");
  console.log(`Loading screen for: ${pageId}`);

  // --- 1. CLEAN UP THE PREVIOUS GAME (if one was active) ---
  if (window.currentGameInstance) {
    window.currentGameInstance.destroy();
    window.currentGameInstance = null;
  }
  if (currentGameScript) {
    currentGameScript.remove();
    currentGameScript = null;
  }

  // --- 2. LOAD THE NEW HTML CONTENT ---
  try {
    const response = await fetch(`${pageId}.html`);
    if (!response.ok) throw new Error("Network response was not ok");
    screen.innerHTML = await response.text();
  } catch (error) {
    console.error("Failed to load page:", error);
    screen.innerHTML = `<p>Error loading content. Please try again.</p>`;
  }
}

function loadGameScript(gameId) {
  console.log(`Loading game script for: ${gameId}`);

  const script = document.createElement("script");
  script.src = `${gameId}.js`;
  script.id = "game-script";
  document.body.appendChild(script);

  // Store a reference to this script so it can be cleaned up next time
  currentGameScript = script;
}

/**
 * Loads pages that ARE games by combining the two functions above.
 * For game pages, you will call this function.
 */
async function loadGame(gameId) {
  await loadScreen(gameId); // This clears the old game and loads the new HTML
  loadGameScript(gameId); // This loads the new game's script
}
