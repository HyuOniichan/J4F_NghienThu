const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let isSpace = false;
let gameOver = false;
let score = 0;
let modifyByTime = 1;
let spd = -5;
const mainCircle = {
    x: 195,
    y: 550,
    radius: 10,
    color: 'black',
    speed: spd,
};

const tailLength = 15;
const tail = Array.from({ length: tailLength }, (_, i) => ({
    x: mainCircle.x,
    y: mainCircle.y + i * 5,
    radius: mainCircle.radius - (i * (mainCircle.radius / tailLength)),
    opacity: 1 - i / tailLength,
    color: 'black',
}));

function drawMainCircle() {
    ctx.fillStyle = mainCircle.color;
    ctx.beginPath();
    ctx.arc(mainCircle.x, mainCircle.y, mainCircle.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawTail() {
    tail.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateTailColors() {
    tail.forEach((t, index) => {
        setTimeout(() => {
            t.color = (mainCircle.color === 'white') ? 'white' : 'black';
        }, index * 10);
    });
}

let objects = [];
let delayTime = 1000;
let objectInterval;

function createObject() {
    const x = Math.random() * (canvas.width - 20);
    objects.push({ x: x, y: 0, width: 20, height: 20 });
}

function createObjectAtEdge() {
    objects.push({ x: -10, y: 0, width: 20, height: 20 });
    objects.push({ x: canvas.width - 10, y: 0, width: 20, height: 20 });
}

function drawObjects() {
    ctx.fillStyle = 'red';
    objects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
}

function updateObjects() {
    objects.forEach((obj) => {
        obj.y += 1 * modifyByTime;
        if (
            obj.x < mainCircle.x + mainCircle.radius &&
            obj.x + obj.width > mainCircle.x - mainCircle.radius &&
            obj.y < mainCircle.y + mainCircle.radius &&
            obj.y + obj.height > mainCircle.y - mainCircle.radius
        ) {
            gameOver = true;
        }
    });
}

function updateMainCircle() {
    mainCircle.x += (isSpace) ? -mainCircle.speed : mainCircle.speed;

    if (mainCircle.x < mainCircle.radius) {
        mainCircle.x = mainCircle.radius;
        createObjectAtEdge();
    }
    if (mainCircle.x + mainCircle.radius > canvas.width) {
        mainCircle.x = canvas.width - mainCircle.radius;
        createObjectAtEdge();
    }

    for (let i = tailLength - 1; i > 0; i--) {
        tail[i].x = tail[i - 1].x;
    }
    tail[0].x = mainCircle.x;
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Meter : ${score.toFixed(2)}`, 10, 20);
}

let isBoost = false;
let boosting = 0;
let limBoost = 100;

function startGame() {
    if (gameOver) {
        const restart = confirm("Game Over! Your score: " + score.toFixed(2) + ". Do you want to restart?");
        if (restart) {
            resetGame();
            return;
        } else {
            return;
        }
    }
    spd *= modifyByTime;
    score += 0.05 * modifyByTime;
    boosting += 0.05 * modifyByTime;
    modifyByTime = 1 + Math.floor(score) / 100;
    if (boosting % 300 <= 40 && isBoost) {
        isBoost = false;
    }

    if (boosting % limBoost >= limBoost - 50 && score > 0 && !isBoost) {
        isBoost = true;
        boosting = 0;
        score++;
        limBoost += 75;
        clearInterval(objectInterval);
        delayTime = Math.max(100, delayTime - 120);
        objectInterval = setInterval(createObject, delayTime);
    }

    ctx.clearRect( 0, 0, canvas.width, canvas.height);
    drawTail();
    drawMainCircle();
    updateMainCircle();
    drawObjects();
    updateObjects();
    drawScore();
    requestAnimationFrame(startGame);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        isSpace = true;
        mainCircle.color = 'white';
        updateTailColors();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        isSpace = false;
        mainCircle.color = 'black';
        tail.forEach(t => t.color = 'black');
    }
});

function resetGame() {
    score = 0;
    gameOver = false;
    objects = [];
    mainCircle.x = 190;
    modifyByTime = 0;
    boosting = 0;
    limBoost = 200;
    isBoost = false;
    mainCircle.color = 'black';
    clearInterval(objectInterval);
    delayTime = 1000;
    objectInterval = setInterval(createObject, delayTime);
    tail.forEach((t, i) => {
        t.x = mainCircle.x;
        t.y = mainCircle.y + i * 5;
        t.radius = mainCircle.radius - (i * (mainCircle.radius / tailLength));
        t.opacity = 1 - i / tailLength;
    });
    startGame();
}

document.getElementById('gameStart').addEventListener('click', (event) => {
    startGame();
    objectInterval = setInterval(createObject, delayTime);
    event.target.disabled = true;
});