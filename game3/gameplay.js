const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let isSpace = false;
        let gameOver = false;
        let score = 0;
        let modifyByTime = 1;
        let spd = -5;
        const rect = {
            x: 190, // initial x position
            y: 550, // initial y position
            width: 20,
            height: 20,
            color: 'black',
            speed: spd , // Move left initially
        };

        function drawRect() {
            ctx.fillStyle = rect.color;
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        }

        drawRect();
        let objects = []; let delayTime = 1000;

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
            objects.forEach((obj, index) => {
                obj.y += 1 * modifyByTime; // Falling speed
                // Check for collision with rect
                if (
                    obj.x < rect.x + rect.width &&
                    obj.x + obj.width > rect.x &&
                    obj.y < rect.y + rect.height &&
                    obj.y + obj.height > rect.y
                ){
                    gameOver = true;
                }
            });
        }

        function updateRect() {
            rect.x += (isSpace) ? -rect.speed : rect.speed ;

            // Prevent the rectangle from moving out of the canvas
            if (rect.x < 0) {
                rect.x = 0;
                createObjectAtEdge();
            }
            if (rect.x + rect.width > canvas.width) {
                rect.x = canvas.width - rect.width;
                createObjectAtEdge();
            }
        }

        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Meter : ${score.toFixed(2)}`, 10, 20);
        }

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
            modifyByTime = 1 + Math.floor(score) / 100;
            delayTime = 1000 - Math.floor(score / 10);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRect();
            updateRect();
            drawObjects();
            updateObjects();
            drawScore();
            requestAnimationFrame(startGame);
        }
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                isSpace= true; // Set flag to true when space is pressed
            }
        });
        
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                isSpace = false; // Set flag to false when space is released
            }
        });
        
        function resetGame() {
            // Reset game variables
            score = 0;
            gameOver = false;
            objects = [];
            rect.x = 190; // Reset rectangle position
            rect.color = 'black'; // Reset rectangle color
            startGame(); // Restart the game
        }

        document.getElementById('gameStart').addEventListener('click', (event) => {
            // Start the game
            startGame();
            setInterval(createObject, delayTime);
            // Disable the button to prevent multiple clicks
            event.target.disabled = true; 
        });