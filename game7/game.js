//array
let field = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
]
console.log(field)
//history
let history = []
let scoreHistory = [0]
//score 
let score = 0
let updateScore = setInterval(() =>{document.getElementById('score').textContent = `Score: ${score}`},100)
//undo button
const undo = document.getElementById('undo')
undo.addEventListener('click', onUndo)
function onUndo(){
    if(history.length > 1){
        let prev = history.slice(0, history.length - 1)
        history = prev
        if(scoreHistory.length > 1){
        let sc = scoreHistory.slice(0, history.length - 1)
        scoreHistory = sc
        score = scoreHistory[scoreHistory.length - 1]
        }
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                field[i][j] = history[history.length - 1][i][j]
            }
        }
        recreateDiv()
        paint()
    }
}

function recreateDiv() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const box = document.getElementById(`b${i}${j}`);
            while (box.firstChild) {
                box.removeChild(box.firstChild);
                console.log('remove child')
            }
            if (field[i][j] !== 0) {
                const newChild = document.createElement('div');
                newChild.classList.add('child');
                newChild.textContent = field[i][j];
                box.appendChild(newChild);
            }
        }
    }
}
//create random child?
function makeRandomChild(){
    let pos = Math.floor(Math.random() * 16)
    let limit = 20
    while(true){
        if(field[Math.floor(pos / 4) % 4][pos % 4] === 0) break
        else{
            limit--
            pos++
        }
        if(limit === 0){
            return
        }
    }
    const randomValue = (Math.random() < 0.66) ? 2 : 4
    const row = Math.floor(pos / 4) % 4
    const col = pos % 4
    const newChild = document.createElement('div')
    newChild.classList.add('child')
    newChild.textContent = randomValue 
    document.getElementById(`b${row}${col}`).appendChild(newChild)
    field[row][col] = randomValue
}

makeRandomChild()
makeRandomChild()
if(true){
let tempField = field.map(array => {return array.slice();});
history.push(tempField)
}
//check losing / winning
function onLose(){
    let fieldResize = []
    for(let i = 0; i < 6; i++){
        let temp = []
        for(let j = 0; j < 6; j++){ 
            temp.push((i >= 1 && i <= 4 && j >= 1 && j <= 4) ? field[i - 1][j - 1] : 0)
        }
        fieldResize.push(temp)
    }
    let check = 16
    for(let i = 1; i < 5; i++){
        for(let j = 1; j < 5; j++){
            const value = field[i - 1][j - 1]
            check -= (value != fieldResize[i+1][j] && value != fieldResize[i-1][j] && value != fieldResize[i][j+1] && value != fieldResize[i][j-1] && value !== 0) ? 
            1 : 0
        }
    }
    if(check === 0){
        alert('you lose')
        clearInterval(checkLose)
    }
}
let checkLose = setInterval(onLose,200)

function onWin(){
    let isWin = false
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(field[i][j] === 2048) isWin = true
        }
    }
    if(!isWin) return
    alert('you win')
    clearInterval(checkWin)
}

let checkWin = setInterval(onWin,200)

//get color
// color map
const colorPalette = [
    '#ffb5b5', //2
    '#f76b8a', //4
    '#5c5470', //8
    '#42b883', //16
    '#118a7e', //32
    '#c24d2c', //64
    'aqua', //128
    'red', //256
    '#407088', //512
    '#6643b5', //1024
    '#005689', //2048 wwin
    '#45171d', //4096
    '#9ba6a5', //8192
    'black', //16384
    '#c54c82', //32768
    '#bc2525', //65536
    '#363b4e', //131072
]

function paint(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            const box = document.getElementById(`b${i}${j}`)
            if(box.firstChild){
                const color = colorPalette[Math.log2(field[i][j]) - 1]
                box.firstChild.style.backgroundColor = color
                box.firstChild.style.color = (field[i][j] <= 256)  ? 'black' : 'orangered'
                box.firstChild.textContent = field[i][j]
            }
        }
    }
}
paint()
//check equal 2 array
function isEqual(field1,field2){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(field1[i][j] !== field2[i][j]) return false
        }
    }
    return true
}
/* ---> movement logic <--- */
document.addEventListener('keydown',handleKeyDown)
function handleKeyDown(k) {
    switch(k.key){
    case 'ArrowRight':
    case 'd' :
        handleRight()
        break;
    case 'ArrowLeft':
    case 'a' :
        handleLeft()
        break;
    case 'ArrowUp':
    case 'w' :
        handleUp()
        break;
    case 'ArrowDown':
    case 's' :
        handleDown()
        break;
    default:
        console.log('please use arrow key or WASD')
    }
}
//animation + new block
function lastAct(movement){
clearInterval(checkLose)
checkLose = setInterval(onLose,200)
getAnimation(movement)
setTimeout(() =>{
    makeRandomChild()
    document.addEventListener('keydown',handleKeyDown)
    for(let i = 0; i < 4; i++){
        for(let j = 0;j < 4; j++){
            const parent = document.getElementById(`b${i}${j}`)
            const last = parent.lastChild
            if(parent.firstChild !== parent.lastChild) parent.removeChild(last)
        }
    }
    let tempField = field.map(array => {return array.slice();});
    history.push(tempField)
    scoreHistory.push(score)
    paint()
},150)
}

//handle right
function handleRight(){
    let movement = []
    let tempField = field.map(array => {return array.slice();});
    //handle each row with logic...
    for(let i = 0; i < 4; i++){
        let isMerge = false
        //logic: pick from right to left,start from 2nd place bc 1st place can't move, then move from left to right, if is not merge and equal then merge, else only move
        for(let j = 2; j >=0; j--){
            if(field[i][j] !== 0){
                let temp = {from: [i,j], to: []}
                const value = field[i][j]
                field[i][j] = 0
                //check from position to the end, if meet block will stop
                for(let k = j + 1; k < 4; k++){
                    if(field[i][k] !== 0){
                        //check is merge or not + is equal
                        if(!isMerge && value === field[i][k]){
                            field[i][k] *= 2 // merge!
                            isMerge = true
                            temp.to = [i,k]
                            score += value * 2
                        }
                        else{
                            temp.to = [i,k-1]
                            field[i][k-1] = value
                            isMerge = false
                        }
                        break
                    }
                    else if(k === 3){
                        temp.to = [i,k]
                        field[i][k] = value
                    }
                }
                movement.push(temp)
            }
        }
    }
    isEqual(field,tempField) ? console.log('nothing happen') : lastAct(movement)
}

//handle left
function handleLeft(){
    let movement = []
    let tempField = field.map(array => {return array.slice();});
    for(let i = 0; i <4; i++){
        let isMerge = false
        for(let j = 1; j < 4; j++){
            if(field[i][j] !== 0){
                let temp = {from: [i,j], to: []}
                const value = field[i][j]
                field[i][j] = 0
                for(let k = j - 1; k >= 0; k--){
                    if(field[i][k] !== 0){
                        if(!isMerge && value === field[i][k]){
                            field[i][k] *= 2 // merge!
                            isMerge = true
                            temp.to = [i,k]
                            score += value * 2
                        }
                        else{
                            temp.to = [i,k+1]
                            field[i][k+1] = value
                            isMerge = false
                        }
                        break
                    }
                    else if(k === 0){
                        temp.to = [i,k]
                        field[i][k] = value
                    }
                }
                movement.push(temp)
            }
        }
    }
    isEqual(field,tempField) ? console.log('nothing happen') : lastAct(movement)
}

//handle up
function handleUp(){
    let movement = []
    let tempField = field.map(array => {return array.slice();});
    for(let j = 0; j < 4; j++){
        let isMerge = false
        for(let i = 1; i < 4; i++){
            if(field[i][j] !== 0){
                let temp = {from: [i,j], to: []}
                const value = field[i][j]
                field[i][j] = 0
                for(let k = i - 1; k >= 0; k--){
                    if(field[k][j] !== 0){
                        if(!isMerge && value === field[k][j]){
                            field[k][j] *= 2 // merge!
                            isMerge = true
                            temp.to = [k,j]
                            score += value * 2
                        }
                        else{
                            temp.to = [k+1,j]
                            field[k+1][j] = value
                            isMerge = false
                        }
                        break
                    }
                    else if(k === 0){
                        temp.to = [k,j]
                        field[k][j] = value
                    }
                }
                movement.push(temp)
            }
        }
    }
    isEqual(field,tempField) ? console.log('nothing happen') : lastAct(movement)
}

//handle down
function handleDown(){
    let movement = []
    let tempField = field.map(array => {return array.slice();});
    for(let j = 0; j < 4; j++){
        let isMerge = false
        for(let i = 2; i >= 0; i--){
            if(field[i][j] !== 0){
                let temp = {from: [i,j], to: []}
                const value = field[i][j]
                field[i][j] = 0
                for(let k = i + 1; k < 4; k++){
                    if(field[k][j] !== 0){
                        if(!isMerge && value === field[k][j]){
                            field[k][j] *= 2 // merge!
                            isMerge = true
                            temp.to = [k,j]
                            score += value * 2
                        }
                        else{
                            temp.to = [k-1,j]
                            field[k-1][j] = value
                            isMerge = false
                        }
                        break
                    }
                    else if(k === 3){
                        temp.to = [k,j]
                        field[k][j] = value
                    }
                }
                movement.push(temp)
            }
        }
    }
    isEqual(field,tempField) ? console.log('nothing happen') : lastAct(movement)
}

//get animation
function getAnimation(arr) {
    if(arr.length === 0) return;
    arr.forEach(set => {
    document.removeEventListener('keydown', handleKeyDown);
    const fromDiv = document.getElementById(`b${set.from[0]}${set.from[1]}`);
    const toDiv = document.getElementById(`b${set.to[0]}${set.to[1]}`);
    if (fromDiv && toDiv && fromDiv.firstChild) { 
        const child = fromDiv.firstChild;
        const toX = toDiv.offsetLeft - fromDiv.offsetLeft;
        const toY = toDiv.offsetTop - fromDiv.offsetTop;

        child.style.transition = 'transform 150ms ease';
        child.style.transform = `translate(${toX}px, ${toY}px)`;

        setTimeout(() => {
        toDiv.appendChild(child);
        child.style.transform = 'none';
        child.style.transition = 'none';
        }, 150); 
    }
    });
}
//restart button
const restart = document.getElementById('newGame')
restart.addEventListener('click', newGame)
function newGame(){
    field = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ]
    recreateDiv()
    makeRandomChild()
    makeRandomChild()
    let tempField = field.map(array => {return array.slice();});
    history.push(tempField)
    scoreHistory = [0]
    paint()
}