// ... (button click listener is the same as above) ...

async function loadScreen(link) {
  try {
    // Get the screen element when the function is called
    const gameScreen = document.getElementById("screen");

    // Fetch the content of the game's HTML file
    const response = await fetch(`${link}.html`);
    if (!response.ok) throw new Error("Network response was not ok");

    const gameHtml = await response.text();

    // Put the fetched HTML into the screen
    gameScreen.innerHTML = gameHtml;

    // Run game-specific JavaScript
    // Remove the old game's script to prevent conflicts
    if (currentGameScript) {
      currentGameScript.remove();
    }

    // Create a new script element
    const script = document.createElement("script");

    // Set its source to the game's JS file
    script.src = `${link}.js`;

    // Give it an ID so we can find it and remove it later
    script.id = "game-script";

    // Append the script to the body to execute it
    document.body.appendChild(script);

    // Store a reference to the new script
    currentGameScript = script;
  } catch (error) {
    console.error("Failed to load game:", error);
    const gameScreen = document.getElementById("screen");
    gameScreen.innerHTML = `<p>Error loading game. Please try again.</p>`;
  }
}
