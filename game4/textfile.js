function drawBottle(number) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    // const position = (number <= 5) ? []
    // Draw the bottle
    ctx.fillStyle = "#f0f0f0"; // Brown color for the bottle
    ctx.beginPath();
    ctx.moveTo(60, 40); // Start at the top left of the bottle
    ctx.lineTo(140, 40); // Top right
    ctx.lineTo(140, 250); // Bottom right
    ctx.lineTo(60, 250); // Bottom left
    ctx.closePath();
    ctx.fill();

    // Draw the outline of the bottle
    ctx.strokeStyle = "#000000"; // Black color for the outline
    ctx.lineWidth = 2; // Outline width
    ctx.stroke(); // Apply the outline

    // Draw the water levels
    const waterLevels = [
        { height: 200, color: "#f7cac9" }, // Light Pink
        { height: 150, color: "#1E90FF" }, // Dodger Blue
        { height: 100, color: "#4682B4" }, // Steel Blue
        { height: 50, color: "#5F9EA0" }   // Cadet Blue
    ];

    // Draw each water level from the bottom up
    for (let i = 0; i < waterLevels.length; i++) {
        ctx.fillStyle = waterLevels[i].color;
        // Fill the rectangle for the water level
        ctx.fillRect(61, 250 - waterLevels[i].height, 78, waterLevels[i].height);
    }
}

drawBottle();
//random array 



function createRandomArray() {
    // Step 1: Create a pool of numbers from 0 to 9, each appearing 4 times
    const pool = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 4; j++) {
            pool.push(i);
        }
    }

    // Step 2: Shuffle the pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]; // Swap elements
    }

    // Step 3: Distribute the numbers into 4 arrays
    const result = [];
    for (let i = 0; i < 4; i++) {
        result.push(pool.slice(i * 10, (i + 1) * 10));
    }

    return result;
}

// Generate the random array
const randomArrays = createRandomArray();
console.log(randomArrays);

//perform previous action



let currentState = 0; // Initial game state
const history = []; // Array to keep track of game states

// Function to update the game state
function updateGameState(newState) {
    // Save the current state to history before changing it
    history.push(currentState);
    currentState = newState;

    // Update the display
    document.getElementById('gameState').innerText = `Current State: ${currentState}`;
    document.getElementById('undoButton').disabled = false; // Enable the undo button
}

// Action button functionality
document.getElementById('actionButton').addEventListener('click', () => {
    // Perform some action that changes the game state
    const newState = currentState + 1; // Example action: increment the state
    updateGameState(newState);
});

// Undo button functionality
document.getElementById('undoButton').addEventListener('click', () => {
    if (history.length > 0) {
        currentState = history.pop(); // Revert to the last state
        document.getElementById('gameState').innerText = `Current State: ${currentState}`;
        
        // Disable the undo button if there's no history left
        if (history.length === 0) {
            document.getElementById('undoButton').disabled = true;
        }
    }
});