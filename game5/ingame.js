const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const squareSize = 40
/* draw canvas */
function drawCanvas(){
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 15; j++){
            const color = ((i + j) % 2 === 0) ? '#5585b5' : '#cbf078';
            ctx.fillStyle = color
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
        }
    }
}
drawCanvas()
/* game status */
//food status
let foodPos = [5,10]
let foodColor = 'aqua'
let isEaten = false
// snake head and tails in array of positions (lmao)
let snake = [[1,1],[1,2],[1,3]] 
let snakeHead = [1,3]
let len = 3 // snake length
const snakeColor = 'red'
//modify score and speed
let score = 0
let speed = 600
let limit = 30
let times = 1
let isKeyDown = false
/* create food for snake mlem mlem */

//get new food position after eat
function getFoodPos(){
    while(true){
        let onSnakeTail = false;
        const foodX = Math.floor(Math.random() * 20) // 0 to 19
        const foodY = Math.floor(Math.random() * 15) // 0 to 14
        foodPos = [foodY, foodX]
        for (let i = 0; i < snake.length; i++) {
            if (foodPos[0] === snake[i][0] && foodPos[1] === snake[i][1]) {
              onSnakeTail = true
              break
            }
        }
        if(!onSnakeTail) break;
    }
    console.log(`new food position: ${foodPos}`)
}
getFoodPos()
// draw food
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodPos[1] * squareSize,foodPos[0] * squareSize,squareSize,squareSize);
}

/* create snake */
//draw the snake base on array
function drawSnake(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawCanvas();
    if(isEaten){
        score+=10
        len++
        document.getElementById('Score').textContent=`Score: ${score}`
        getFoodPos()
        isEaten = false
    }
    drawFood();
    while(snake.length > len){
        snake.shift() //reduce base on length
    }
    for(let i = len - 1; i >= 0; i--){
        const y = snake[i][0] * squareSize
        const x = snake[i][1] * squareSize
        ctx.fillStyle = snakeColor
        ctx.fillRect(x,y,squareSize,squareSize)
        ctx.globalAlpha = 0.6 // all tails opacity = 60%
    }
    ctx.globalAlpha = 1.0;
}
drawSnake()

//get direction by key press 
let getPos = [0,1] //first direction : right
let direction = 1 // 1: right , 2 : left , 3 : up, 4 : down
window.addEventListener('keydown', function(e) {
    if(!isPause && !isKeyDown){
        isKeyDown = true
        switch (e.key) {
            case 'ArrowRight':
            case 'd' :
                if(direction != 2)
                    {getPos[1] = 1
                    getPos[0] = 0
                    direction = 1}
                break;
            case 'ArrowLeft':
            case 'a' :
                if(direction != 1)
                    {getPos[1] = -1
                    getPos[0] = 0
                    direction = 2}
                break;
            case 'ArrowUp':
            case 'w' :
                if(direction != 4)
                    {getPos[1] = 0
                    getPos[0] = -1
                    direction = 3}
                break;
            case 'ArrowDown':
            case 's' :
                if(direction != 3)
                    {getPos[1] = 0
                    getPos[0] = 1
                    direction = 4}
                break;
        }
    }    
});

//get new position and draw snake
function getSnake() {
    //check die
    if(Die()){
        alert(`You die . Your score: ${score}`)
        pause()
        document.getElementById('pauseGame').disabled = true
        return;
    }
    //new pos
    const newPosX = (snakeHead[0] + getPos[0] + 15) % 15;
    const newPosY = (snakeHead[1] + getPos[1] + 20) % 20;
    snake.push([newPosX,newPosY]);
    snakeHead = snake[snake.length - 1];
    isEaten = snakeHead[0] === foodPos[0] && snakeHead[1] === foodPos[1];
    console.log(isEaten)
    drawSnake();
    isKeyDown = false
    //fasten speed 
    if(score >= limit){
        limit += 30 * times
        times++
        speed = (speed - 80 >= 40) ? speed - 80 : 30
        pause()
        resume()
    }
}
/*check if die */
function Die(){
    for(let i = 0; i < len - 1; i++){
        if(snakeHead[0] === snake[i][0] && snakeHead[1] === snake[i][1]) return true
    }
    return false;
}
/*set snake movement */
let isResume = false
let moveSnake = setInterval(getSnake, speed)
//clear the interval
function pause() {
    clearInterval(moveSnake);
    isResume = false
}
//start new interval
function resume() {
    if(!isResume){
        moveSnake = setInterval(getSnake, speed);
        isResume = true
    }
}

/*game button control */
//start the game
function gameStart(){
    foodPos = [5,10]
    foodColor = 'aqua'
    isEaten = false
    snake = [[1,1],[1,2],[1,3]] 
    snakeHead = [1,3]
    len = 3
    score = 0
    speed = 600
    limit = 50
    times = 1
    direction = 1
    getPos = [0,1] 
    isPause = true
    isKeyDown = false
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawCanvas();
    drawSnake();
    drawFood();
    gameStatus();
    document.getElementById('pauseGame').disabled = false;
}
document.getElementById('newGame').addEventListener('click',gameStart)
//pause - resume the game progress
let isPause = false
function gameStatus(){
    if(isPause){
        resume()
        document.getElementById('pauseGame').textContent = "Pause"
    }
    else{
        pause()
        document.getElementById('pauseGame').textContent = "Resume"
    }
    isPause = !isPause
}
document.getElementById('pauseGame').addEventListener('click',gameStatus)