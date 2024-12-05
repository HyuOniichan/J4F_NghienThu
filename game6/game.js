/* --->your field here<--- */
/*debug*/
function debug(debug){
    console.log(debug)
}
/* get canvas */
const canvas = document.getElementById('myField')
const ctx = canvas.getContext('2d')
const fieldArea = 390
canvas.width = fieldArea
canvas.height = fieldArea
const squareSize = fieldArea / 10
/* fill function */
function fillHere(ctx, arr, color, size) {
    ctx.fillStyle = color;
    ctx.fillRect(arr[1] * size, arr[0] * size, size, size);
}
/* draw canvas */
function drawCanvas() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const color = ((i + j) % 2 === 0) ? '#f0f0f0' : '#00bbf0';
                fillHere(ctx, [i, j], color, squareSize);
            }
        }
}
drawCanvas();
/* create arrow to point to the one who get turn */
//check turn
let checkTurn = true //true: your turn; false: bot turn
//get arrow canvas
const Arrow = document.getElementById('arrow')
const actx = Arrow.getContext('2d')
//draw arrow
function getTurn(){
    actx.clearRect(0,0,200,200);
    actx.beginPath();
    actx.moveTo(50,50);
    (checkTurn) ? actx.lineTo(100,100) : actx.lineTo(0,100) ;
    actx.lineTo(50,150);
    actx.closePath();
    actx.fillStyle = (checkTurn) ? 'red' : 'darkblue' ;
    actx.fill();
    actx.strokeStyle = 'black';
    actx.stroke();
    document.getElementById('tutorial').textContent = '';
}
//
//
//
/* IMPORTANT: get all information on field */
let fieldInfo = []
let botFieldInfo = []
/* IMPORTANT: just to be sure */
//
//
//
/* get button confirm */
const cf = document.getElementById('confirm')
cf.disabled = true
cf.addEventListener('click', () => {
    let checkcf = confirm('xac nhan doi hinh cua ban?');
    if(checkcf){
        confirmed();
    }
})
/* --->Ship field here<--- */
/* draw ship field */
const ships = document.getElementById('ships')
const editShip = ships.getContext('2d')
function drawShipsField(){
    editShip.globalAlpha = 0.6;
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            const color = ((i + j) % 2 === 0) ? '#f0f0f0' : '#000';
            fillHere(editShip, [i,j], color, 30)
        }
    }
    editShip.globalAlpha = 1.0;
}
drawShipsField()
/* fill all available ships to the shipfield */
//get all available ship
let shipArr = [1,2,3,4] // 1 1x4 2 1x3 3 1x2 4 1x1
//get color base on ship length
const shipColor = ['orange','blue','green','purple']
//draw ships
function getShip(){   
    //clear canvas
    editShip.clearRect(0, 0, ships.width, ships.height);
    drawShipsField(); 
    //get col
    let b = 1
    //ship 1x4
    if(shipArr[0] > 0){
        for(let i = 1; i < 5; i++){
            fillHere(editShip, [1,i], shipColor[0] , 30);
        }
    }
    //ship 1x3
    b = 2
    for(let a = shipArr[1]; a > 0; a--){
        for(let i = b; i < 3 + b; i++){
            fillHere(editShip, [3,i], shipColor[1], 30);
        }
        b += 4
    }
    //ship 1x2
    b = 1
    for(let a = shipArr[2]; a > 0; a--){
        for(let i = b; i < 2 + b; i++){
            fillHere(editShip, [6,i], shipColor[2], 30);
        }
        b += 3
    }
    //ship 1x1
    b = 1
    for(let a = shipArr[3]; a > 0; a--){
        for(let i = b; i < 1 + b; i++){
            fillHere(editShip, [8,i], shipColor[3], 30);
        }
        b += 2
    }
}
getShip()
/* draw all the ships on the canvas after click */
//get field in array 2d with size 10x10
let field = []
for(let i = 0; i < 10; i++){
    field.push([0,0,0,0,0,0,0,0,0,0])
}
let tempField
//check legal
let isLegal = true
function checkCorner(field,i,j){
    if(field[i][j] === 0){ return false}
    let c1 = i === 0;
    let c2 = i === 9;
    let c3 = j === 0;
    let c4 = j === 9;
    if(c1 && c3) return field[1][1] === 1;
    if(c2 && c4) return field[8][8] === 1;
    if(c1 && c4) return field[1][8] === 1;
    if(c2 && c3) return field[8][1] === 1;
    if(c1) return field[1][j -1] === 1 || field[1][j+1] === 1;
    if(c2) return field[8][j -1] === 1 || field[8][j+1] === 1;
    if(c3) return field[i-1][1] === 1 || field[i+1][1] === 1;
    if(c4) return field[i-1][8] === 1 || field[i+1][8] === 1;
    return !(field[i+1][j+1] === 0 && field[i-1][j-1] === 0 && field[i-1][j+1] === 0 && field[i+1][j-1] === 0);
}
//find ship direction
function toRight(length, row, col){
    if(col > 9 || tempField[row][col] == 0) return length;
    tempField[row][col] = 0; // for no duplicate check
    if((row > 0 && tempField[row -1][col] == 1) || (row < 9 && tempField[row + 1][col] == 1)) isLegal = false;
    fillHere(ctx, [row,col], 'black', squareSize); // if illegal
    return toRight(length + 1, row, col + 1);
}

function toDown(length, row, col){
    if(row > 9 || tempField[row][col] == 0) return length;
    tempField[row][col] = 0; // for no duplicate check
    if((col < 9 && tempField[row][col+1] ==1) || (col > 0 && tempField[row][col-1] ==1 )) isLegal = false;
    fillHere(ctx, [row,col], 'black', squareSize); // if illegal
    return toDown(length + 1, row + 1, col);
}
//draw the ship with color
function drawShip(){
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCanvas();
    //reset legal and shipArr
    isLegal = true
    shipArr = [1,2,3,4]
    //get temp field
    tempField = field.map(array => {return array.slice();});
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            //i : row , j : col
            if(tempField[i][j] === 1){
                let onRight = toRight(1, i, j + 1)
                let onDown = toDown(1, i + 1, j)
                if(onRight > 1 && onDown > 1 || onRight > 4 || onDown > 4) isLegal = false;
                if(onRight > onDown){
                    if(4 - onRight >= 0) shipArr[4 - onRight]--
                    const color = (4 - onRight >= 0) ? shipColor[4 - onRight] : 'black' 
                    for(let k = 0; k < onRight;k++){
                        fillHere(ctx, [i,j], color, squareSize)
                        j++
                    }
                }
                else{
                    if(4 - onDown >= 0) shipArr[4 - onDown]--
                    const color = (4 - onDown >= 0) ? shipColor[4 - onDown] : 'black'
                    for(let k = 0; k < onDown; k++){
                        fillHere(ctx, [i + k,j], color, squareSize)
                    }
                }        
            }
        }
    }
    for(let i of shipArr){
        if(i != 0){
            isLegal = false
            break
        }
    }
}
/* check the player canvas for every ship being made */
//get legal test check
const checkLegal = document.getElementById('if-Ilegal')
//get the click on canvas
function handleFieldClick(event) {
    const mouseX = event.offsetY;
    const mouseY = event.offsetX;
    let clickRect = [Math.floor(mouseX / squareSize),Math.floor(mouseY / squareSize)] ;
    console.log(clickRect);
    field[clickRect[0]][clickRect[1]] = (field[clickRect[0]][clickRect[1]] == 0) ? 1 : 0 ;//switch click/not click
    drawShip();
    getShip();
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            if(checkCorner(field,i,j)) isLegal = false
        }
    }
    if(!isLegal ){
        checkLegal.textContent = 'The field is illegal'
        cf.disabled = true
    }
    else{
        checkLegal.textContent = 'The field is legal'
        cf.disabled = false
    }
}
//add event listen
canvas.addEventListener('click', handleFieldClick)
let winlose
/* ---> action after confirm <--- */
function confirmed(){
    const step1 = document.getElementById('firstStep');
    /* get the info */
    //
    fieldInfo = findShip(field)
    //
    debug(field)
    while(step1.firstChild){
        step1.removeChild(step1.firstChild)
        canvas.removeEventListener('click', handleFieldClick)
    }
    //for delay
    setTimeout( () => {
        winlose = setInterval(checkwinning,100)
        botDiv.appendChild(botCanvas);
        Arrow.style.display = 'block';
        getTurn();
        document.getElementById('tutorial').textContent = '*click on opponent\'s field to shoot';
        document.querySelectorAll('body > div').forEach(div => {div.style.margin ='0 30px' ;})
    }, 500)
}
/* ---> begin the battle after confirm the field <--- */
/* create bot field */
//get bot div
const botDiv = document.getElementById('bot')
//create canvas for bot
const botCanvas = document.createElement('canvas')
const botCtx = botCanvas.getContext('2d')
botCanvas.id = 'botCanvas'
botCanvas.height = fieldArea
botCanvas.width = fieldArea
function drawBotCanvas() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const color = ((i + j) % 2 === 0) ? '#dcd6f7' : '#ff0000';
            fillHere(botCtx, [i, j], color, squareSize);
        }
    }
}
drawBotCanvas()
/* Get bot's field */
// Initialize the game botField 
let botField = Array.from({ length: 10 }, () => Array(10).fill(0));
// Ship configuration
const botships = [
    { name: 'Battleship', size: 4, count: 1 },
    { name: 'Cruiser', size: 3, count: 2 },
    { name: 'Destroyer', size: 2, count: 3 },
    { name: 'Submarine', size: 1, count: 4 }
];
// Function to check if a position is valid for placing a ship 
function isValidPosition(botField, row, col, length, direction) {
    for (let i = 0; i < length; i++) {
        const r = direction === 'horizontal' ? row : row + i;
        const c = direction === 'horizontal' ? col + i : col;
        // Check boundaries
        if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
        // Check if the cell is already occupied
        if (botField[r][c] === 1) return false;
        // Check surrounding cells to ensure no touching
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue; // Skip the cell itself
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && botField[nr][nc] === 1) {
                    return false; // Adjacent cell is occupied
                }
            }
        }
    }
    return true;
}
// Function to place a ship on the botField 
function placeShip(botField, size) {
    let placed = false;
    while (!placed) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (isValidPosition(botField, row, col, size, direction)) {
            for (let i = 0; i < size; i++) {
                if (direction === 'horizontal') {
                    botField[row][col + i] = 1;
                } else {
                    botField[row + i][col] = 1;
                }
            }
            placed = true;
        }
    }
}

function placeRandom(botField, size) {
    let placed = false;
    while (!placed) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (isValidPosition(botField, row, col, size, direction)) {
            for (let i = 0; i < size; i++) {
                if (direction === 'horizontal') {
                    botField[row][col + i] = 1;
                } else {
                    botField[row + i][col] = 1;
                }
            }
            placed = true;
        }
    }
}

/* get random field for player */
document.getElementById('getRandom').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field = [];
    for(let i = 0; i < 10; i++){
        field.push([0,0,0,0,0,0,0,0,0,0])
    }
    botships.forEach(ship => {
        for (let i = 0; i < ship.count; i++) {
            placeRandom(field, ship.size);
        }
    });
    drawShip()
    getShip()
    checkLegal.textContent = 'The field is legal'
    cf.disabled = false
})
/* Place all ships on the botField */
botships.forEach(ship => {
    for (let i = 0; i < ship.count; i++) {
        placeShip(botField, ship.size);
    }
});
// debug(botField);

/* get the info */
//
botFieldInfo = findShip(botField)
//
/* ---> handle the shoot from player/bot <--- */
/* handle win/lose */
function checkWin(field){
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            if(field[i][j] === 1) return false
        }
    }
    return true
}
//get interval
let delayTime = 1000
let botInt 
function startBotTurn(){
    botInt = setInterval(botTurn, delayTime)
    botCanvas.removeEventListener('click',handlePlayerShoot)
}
function endBotTurn() {
    clearInterval(botInt)
    botCanvas.addEventListener('click',handlePlayerShoot)
}
function checkwinning(){
    if(checkWin(field)){
        alert('you lose')
        endBotTurn()
        checkTurn = true 
        getRestartButton()
        botCanvas.removeEventListener('click', handlePlayerShoot);
    }
    if(checkWin(botField)){
        alert('you win')
        checkTurn = true 
        getRestartButton()
        botCanvas.removeEventListener('click', handlePlayerShoot);
    }
}
/* handle player shoot */
//function to find the current ship info
function currentShipInfo(info,i,j){
    for(let k = 0; k < info.length;k++){
        const tempInfo = info[k].cells
        for(let h = 0; h < tempInfo.length;h++){
            const arr = tempInfo[h]
            if(arr[0] === i && arr[1] == j){
                return info[k]; // Return the entire ship object
            }
        }
    }
    console.log('no cell found')
    return []
}
function currentBotShipInfo(info,i,j){
    for(let k = 0; k < info.length;k++){
        const tempInfo = info[k].cells
        for(let h = 0; h < tempInfo.length;h++){
            const arr = tempInfo[h]
            if(arr[0] === i && arr[1] == j){
                info[k].cells.splice(h,1)
                return info[k]; // Return the entire ship object
            }
        }
    }
    console.log('no cell found')
    return []
}
//get click
botCanvas.addEventListener('click',handlePlayerShoot)
//handle player shoot
function handlePlayerShoot(event){
    console.log('your turn')
    //if is player turn
    if(checkTurn === true){
        //get click square
        const mouseX = event.offsetY;
        const mouseY = event.offsetX;
        let clickRect = [Math.floor(mouseX / squareSize),Math.floor(mouseY / squareSize)] ;
        // console.log(clickRect);
        const clickSq = botField[clickRect[0]][clickRect[1]];
        //if the square is not shoot yet
        if(clickSq !== -1){
            botField[clickRect[0]][clickRect[1]] = -1
            if(clickSq === 1){
                fillHere(botCtx,clickRect,'blue',squareSize)
                const sunkShip = currentBotShipInfo(botFieldInfo,clickRect[0],clickRect[1]) // Get the whole ship object
                if(sunkShip.cells.length === 0){
                    blow(sunkShip,botCtx,'pink',botField)
                }
            }
            else{
                fillHere(botCtx,clickRect,'black',squareSize)
                checkTurn = false
                getTurn()
                startBotTurn()
            }
        }
    }
}

/* handle bot shoot */
let findingShip = false
let shipInfo = []
let shipPos = []
let getRandDirection = [[0,1],[1,0],[0,-1],[-1,0],[0,1],[1,0],[0,-1],[-1,0],[0,1],[1,0],[0,-1],[-1,0],]
let getDirection
let findingLimit = 8
let isLen = 1
//bot shoot
function botTurn() {
    console.log('bot turn');
    if (!findingShip) {whenNotFindingShip()}
    function whenNotFindingShip(){
        delayTime = (delayTime > 50) ? delayTime - 10 : 50
        //get position that is not being fire
        findingLimit = 8
        isLen = 1
        let ranNum = Math.random() * 100;
        while (field[Math.floor(ranNum / 10)][Math.floor(ranNum % 10)] === -1) {
            ranNum++
        }
        const row = Math.floor(ranNum / 10)
        const col = Math.floor(ranNum % 10)
        if (field[row][col] === 1) {
            debug('find 1')
            field[row][col] = -1
            findingShip = true;
            shipInfo = currentShipInfo(fieldInfo, row, col);
            debug(`ship found: at ${row} , ${col}`)
            debug(shipInfo)
            shipPos = [row, col];
            tryLeftUp = (row === 0 || col === 0 || Math.random() < 0.6) ? false : true;
            fillHere(ctx, [row, col], 'red', squareSize);
            let randomStart = Math.floor(Math.random() * 4) 
            getDirection = getRandDirection.splice(randomStart,8);
            getRandDirection = [[0,1],[1,0],[0,-1],[-1,0],[0,1],[1,0],[0,-1],[-1,0],[0,1],[1,0],[0,-1],[-1,0],]
        } else {
            field[row][col] = -1
            fillHere(ctx, [row, col], 'black', squareSize);
            findingShip = false;
            checkTurn = true;
            getTurn();
            endBotTurn()
        }
    }
    if (findingShip) {whenFindingShip()}
    // Check if a ship is found
    function whenFindingShip() {
        findingLimit--
        if(findingLimit === 0){
            findingShip = false
            debug('reach find limit')
        }
        if (shipInfo.cells.length === 1) {
            fillHere(ctx, shipPos, 'red', squareSize);
            blow(shipInfo, ctx, 'pink', field);
            findingShip = false;
            delayTime = (delayTime > 50) ? delayTime - 10 : 50
        } else {
            let goto = getDirection.shift();
                for(let l = 1; l < 4; l++){
                // Check if the next position is valid and not already shot
                const newPosX = shipPos[0] + goto[0] * l;
                const newPosY = shipPos[1] + goto[1] * l;
                if (newPosX >= 0 && newPosX <= 9 && newPosY >= 0 && newPosY <= 9 ) { // Check if it's part of the ship
                    if(field[newPosX][newPosY] === -1){
                        debug('is currently equal -1')
                        break;} 

                    if(field[newPosX][newPosY] === 1){
                        isLen++
                        if(isLen === 2){getDirection.shift()}
                        field[newPosX][newPosY] = -1;
                        fillHere(ctx, [newPosX, newPosY], 'red', squareSize);
                        delayTime = (delayTime > 50) ? delayTime - 10 : 50
                        if (shipInfo.cells.length === isLen) {
                            blow(shipInfo, ctx, 'pink', field);
                            findingShip = false;
                            debug(`ship with ${isRight} length`)
                            break
                        }
                    } 
                    else {
                        field[newPosX][newPosY] = -1;
                        fillHere(ctx, [newPosX, newPosY], 'black', squareSize);
                        checkTurn = true;
                        endBotTurn();
                        getTurn();
                        debug('miss')
                        return;
                    }
                }
            }
        }
    }
    if(checkTurn) endBotTurn()
}

/* if all the ship part is found */
function blow(ship, ctx, color, field) {
    console.log('blow!');
    // Get ship's head and tail coordinates
    const headRow = ship.head[0];
    const headCol = ship.head[1];
    const tailRow = ship.tail[0];
    const tailCol = ship.tail[1];
    // Determine the bounding box of the ship
    const startRow = Math.max(0, headRow - 1);
    const startCol = Math.max(0, headCol - 1);
    const endRow = Math.min(9, tailRow + 1);
    const endCol = Math.min(9, tailCol + 1) // Loop through all cells within the bounding box
    ctx.globalAlpha = 0.8;
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            // Check if the cell is within the ship's area
            if (i >= headRow && i <= tailRow && j >= headCol && j <= tailCol) {
                fillHere(ctx, [i, j], color, squareSize); // Color the ship with 'color'
            } else {
                fillHere(ctx, [i, j], '#87e5da', squareSize); // Color surrounding cells
            }
            field[i][j] = -1
        }
    }
    ctx.globalAlpha = 1.0;
}
/* find Ships ( code AI go brrrrr) */
function findShip(grid) {
    // Initialize variables
    let ships = [];
    let visited = new Array(10).fill(0).map(() => new Array(10).fill(false)); // 2D array to track visited cells
    // Iterate through the grid
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (grid[i][j] === 1 && !visited[i][j]) {
                // Found the head of a ship
                let shipCells = [[i, j]];
                let head = [i, j];
                let tail = [i, j];
                let shipLength = 1;
                // Explore the ship in all directions
                let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                for (let dir of directions) {
                    let row = i + dir[0];
                    let col = j + dir[1];
                    
                    let currentTail = [row, col];
        
                    // Explore the ship in the chosen direction
                    while (row >= 0 && row < 10 && col >= 0 && col < 10 && grid[row][col] === 1 && !visited[row][col]) {
                    visited[row][col] = true;
                    shipCells.push([row, col]);
                    shipLength++;
                    tail = currentTail; // Update the tail
                    row += dir[0];
                    col += dir[1];
                    currentTail = [row, col]; // Update the potential tail for next iteration
                    }
                }
                // Add the ship details to the ships array
                ships.push({
                    length: shipLength,
                    head: head,
                    tail: tail,
                    cells: shipCells,
                });
            }
        }
    }
    return ships;
}
/* on win/lose : restart game */
function getRestartButton() {
    const step1 = document.getElementById('firstStep');
    Arrow.style.display = 'none'
    clearInterval(winlose);
    canvas.removeEventListener('click', handleFieldClick);
    do { 
        if (step1.firstChild && step1.firstChild.tagName !== 'BUTTON') {
            step1.removeChild(step1.firstChild);
        } 
    } while (step1.firstChild);
    const restart = document.createElement('button');
    restart.textContent = 'Restart';
    restart.style.backgroundColor = '#6173f4';
    restart.style.width = '100px';
    restart.style.height = '50px';
    step1.appendChild(restart);
    restart.addEventListener('click', function() {
        location.reload();
    });
}