const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let basket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    width: 50,
    height: 20,
    speed: 7,
};

let objects = [];
let score = 0
let gameOver = false;

function createObject() {
    const x = Math.random() * (canvas.width - 20);
    objects.push({ x: x, y: 0, width: 20, height: 20 });
}

function drawBasket() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawObjects() {
    ctx.fillStyle = 'red';
    objects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
}

function updateObjects() {
    objects.forEach((obj, index) => {
        obj.y += 2; // Falling speed
        // Check for collision with basket
        if (
            obj.x < basket.x + basket.width &&
            obj.x + obj.width > basket.x &&
            obj.y < basket.y + basket.height &&
            obj.y + obj.height > basket.y
        ) {
            score++;
            objects.splice(index, 1); // Remove caught object
        } else if (obj.y > canvas.height) {
            gameOver = true; // Object fell off the screen
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawObjects();
    drawScore();
    updateObjects();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillText('Game Over!', canvas.width / 2 - 50, canvas.height / 2);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 30);
    }
}

// Control the basket
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && basket.x > 0) {
        basket.x -= basket.speed;
    } else if (event.key === 'ArrowRight' && basket.x < canvas.width - basket.width) {
        basket.x += basket.speed;
    }
});

// Start the game
setInterval(createObject, 1000); // Create a new object every second
gameLoop();