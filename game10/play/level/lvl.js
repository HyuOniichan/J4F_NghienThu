/*game level */
import {games as rizz} from "../levels.js"
let games = rizz
function getLevel() {
    const levels = localStorage.getItem('games')
    if(levels) games = JSON.parse(levels)
}
function saveLevel() {
    localStorage.setItem('games', JSON.stringify(games))
}

getLevel()
/* get current level */
let board = [],extraBoard = [], specialBoard = []
const url = new URL(window.location.href)
const levelIndex = Number(url.search.replace(/\D/g, ''))
let currentLevel
if(levelIndex) {
    currentLevel = games[levelIndex - 1]
    if(currentLevel.isLock) {
        alert('the level is currently lock, pls no cheating')
        window.location.href = '..'
    }
    console.log('level info:')
    console.log(currentLevel)
    document.getElementById('levelName').innerText = `Level: ${levelIndex}`
    board = currentLevel.level.map(row => row.map(row => {return row.slice()}))
}
else {
    document.getElementById('redirect').href = '../../build/'
    // alert(games[25].message)
    board = games[25].level.map(row => row.map(row => {return row.slice()}))
}
let tempBoard = []
const defaultPieces = ['pawn','pawn2','rook','knight','bishop','queen','king','enemy',0]
const extraPieces = ['wall','pedestal']
board.forEach(row => {
    let tempRow = [], tempExtra = [],tempSpecial = []
    row.forEach(arr => {
        let p1 = 0,p2 = 0, p3 = 0
        arr.forEach(value => {
            if(defaultPieces.includes(value)) {
                tempRow.push(value)
                p1 = 1
            }
            else if(extraPieces.includes(value)){
                tempExtra.push(value)
                p2 = 2
            }
            else {
                tempSpecial.push(value)
                p3 = 3
            }
        })
        if(!p1) tempRow.push(0)
        if(!p2) tempExtra.push(0)
        if(!p3) tempSpecial.push(0)
    })
    tempBoard.push(tempRow)
    extraBoard.push(tempExtra)
    specialBoard.push(tempSpecial)
})
board = []
board = tempBoard.map(arr => arr.slice())
// console.log(board)
// console.log(extraBoard)
// console.log(specialBoard)
/* common function */
function debug(m){
    console.trace(m)
}
function skibidi() {
    console.log('skibidi')
}
// /* level: */
const divBoard = document.getElementById('board')
//default board size
let w_boardWidth = board[0].length
let h_boardHeight = board.length
//default square size
let s_squareSize = Math.min((600 / h_boardHeight),(1300 / w_boardWidth))
//support div height
document.getElementById('support').style.height = `${h_boardHeight * s_squareSize}px`
//edit support content
document.getElementById('reload').addEventListener('click', () => {location.reload()})
//default animation delay in millisecond
const animationDelay = 123
// starting move
let Moves = 0
//default check on pad
let onPad = false
//default has key in board
let hasKey = true
//default piece on teleport
let isOnTp = false
//modify board size
divBoard.style.width = `${s_squareSize * w_boardWidth}px`
divBoard.style.height = `${s_squareSize * h_boardHeight}px`
//default board color
const evenCellColor = '#ff6f3c'
const oddCellColor = '#393e46'
/* check chess piece? */
const isChessPiece = (piece) => {
    const pieces = ['pawn','pawn2','rook','knight','bishop','queen','king']
    return pieces.includes(piece)
}
const cantMoveThrough = (i,j) => {
    const piece = board[i][j]
    const piece2 = extraBoard[i][j]
    const piece3 = specialBoard[i][j]
    const objects = ['wall','lockblock','triggerblock']
    return objects.includes(piece2) || objects.includes(piece3) || isChessPiece(piece)
}
const solidStand = (i,j) => {
    const piece = board[i][j]
    const piece2 = extraBoard[i][j]
    const piece3 = specialBoard[i][j]
    const objects = ['wall','pedestal','lockblock','triggerblock']
    return objects.includes(piece2) || objects.includes(piece3) || isChessPiece(piece)
}
/* cycle structure */ 
class Node {
    constructor(value) {
        this.value = value; 
        this.next = null; 
    }
}
class cycleList {
    constructor() {
        this.head = null; 
        this.tail = null; 
    }
    push(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
            newNode.next = this.head
        } else {
            this.tail.next = newNode
            this.tail = newNode
            this.tail.next = this.head
        }
    }
    findNext(value) {
        let temp = this.tail
        do {
            temp = temp.next
            const val = temp.value
            if(val[0] === value[0] && val[1] === value[1]) {
                return temp.next.value
            }
            
        } while(temp.next != this.head)
        return 0
    }
}
/* get all enemies and teleports position */
let enemies = [],teleports = new cycleList()
for(let i = 0; i < h_boardHeight; i++) {
    for(let j = 0; j < w_boardWidth; j++) {
        if(board[i][j] === 'enemy') enemies.push([i,j])
        if(specialBoard[i][j] === 'teleport') teleports.push([i,j])
    }
}
function checkTakeEnemy(i,j) {
    return enemies.some(arr => arr[0] === i && arr[1] === j)
}
function arrEqual(arr1,arr2) {
    for(let i = arr1.length - 1; i>= 0; i--) {
        if(arr1[i] != arr2[i]) return false
    }
    return true
}
/*draw board */
function drawBoard() {
    divBoard.innerHTML = ''
    const checkpad = checkOnpad()
    const isChange = (onPad != checkpad)
    onPad = checkpad
    if(isChange) console.log(`pad is trigger to ${onPad}`)
    // isOnTp = checkPieceOnTeleport()
    for(let i = 0; i < h_boardHeight; i++) {
        const childDiv = document.createElement('div')
        childDiv.classList = 'rowDiv'
        for(let j = 0; j < w_boardWidth; j++) {
            const color = ((i + j) % 2) ? oddCellColor : evenCellColor
            const newDiv = document.createElement('div')
            newDiv.style.width = `${s_squareSize}px`
            newDiv.style.height = `${s_squareSize}px`
            newDiv.style.backgroundColor = color
            newDiv.id = `p${i}_${j}`
            if(board[i][j]) {
                newDiv.innerHTML = `<div class="cell"><img src="../../image/${board[i][j]}.png" alt="${board[i][j]}" class="chessImg"></div> `
                newDiv.addEventListener('click', () => { 
                    if(board[i][j] === currentPiece) {
                        drawBoard()
                        currentPiece = ''
                        return
                    }
                    currentPiece = (isChessPiece(board[i][j])) ? (board[i][j] === 'pawn2') ? 'pawn' : board[i][j] : currentPiece
                    handlePieceClick(i,j)
                })
            }
            if(extraBoard[i][j]) {
                const ex = extraBoard[i][j]
                const extraDiv = document.createElement('div')
                extraDiv.classList = 'cell2'
                extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
                newDiv.append(extraDiv)
            }
            if(specialBoard[i][j]) {
                if((specialBoard[i][j] === 'triggerblock' || specialBoard[i][j] === 'untriggerblock') && isChange) {
                    specialBoard[i][j] = (specialBoard[i][j] === 'triggerblock') ? 'untriggerblock' : 'triggerblock'
                }
                const ex = specialBoard[i][j]
                const extraDiv = document.createElement('div')
                extraDiv.classList = 'cell2'
                extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
                newDiv.append(extraDiv)
            }
            childDiv.append(newDiv)
        }
        divBoard.append(childDiv)
    }
}
drawBoard()
/* draw on cell for efficiency */ 
function drawCell(i,j) {
    const cell = document.getElementById(`p${i}_${j}`)
    if(!cell) return
    cell.innerHTML = ''
    const color = ((i + j) % 2) ? oddCellColor : evenCellColor
    cell.style.width = `${s_squareSize}px`
    cell.style.height = `${s_squareSize}px`
    cell.style.backgroundColor = color
    if(board[i][j]) {
        cell.innerHTML = `<div class="cell"><img src="../../image/${board[i][j]}.png" alt="${board[i][j]}" class="chessImg"></div> `
        cell.addEventListener('click', () => { 
            if(board[i][j] === currentPiece) {
                drawBoard()
                currentPiece = ''
                return
            }
            currentPiece = (isChessPiece(board[i][j])) ? (board[i][j] === 'pawn2') ? 'pawn' : board[i][j] : currentPiece
            handlePieceClick(i,j)
        })
    }
    if(extraBoard[i][j]) {
        const ex = extraBoard[i][j]
        const extraDiv = document.createElement('div')
        extraDiv.classList = 'cell2'
        extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
        cell.append(extraDiv)
    }
    if(specialBoard[i][j]) {
        if((specialBoard[i][j] === 'triggerblock' || specialBoard[i][j] === 'untriggerblock') && isChange) {
            specialBoard[i][j] = (specialBoard[i][j] === 'triggerblock') ? 'untriggerblock' : 'triggerblock'
        }
        const ex = specialBoard[i][j]
        const extraDiv = document.createElement('div')
        extraDiv.classList = 'cell2'
        extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
        cell.append(extraDiv)
    }
}
/* handle click on piece */
let currentPiece = ''
let circlePositions = []
let isAnimating = false
function handlePieceClick(i,j) {
    const piece = board[i][j]
    if(!isChessPiece(piece) || specialBoard[i][j] === 'triggerblock') return
    console.log(`piece: ${piece}`)
    let row ,col
    drawBoard()
    circlePositions = []
    const satisfy = () => {return row >= 0 && row < h_boardHeight && col >= 0 && col < w_boardWidth}
    const rookBehavior = () => {
        let direction = [[0,1],[0,-1],[1,0],[-1,0]]
        while(direction.length > 0) {
            const direct = direction.shift()
            row = i + direct[0], col = j + direct[1]
            while(satisfy() && !cantMoveThrough(row,col)) {
                getCircle(row,col)
                row += direct[0]
                col += direct[1]
            }
        }
    }
    const bishopBehavior = () => {
        let direction = [[1,1],[-1,-1],[1,-1],[-1,1]]
        while(direction.length > 0) {
            const direct = direction.shift()
            row = i + direct[0], col = j + direct[1]
            while(satisfy() && !cantMoveThrough(row,col)) {
                getCircle(row,col)
                row += direct[0]
                col += direct[1]
            }
        }
    }
    switch(piece) {
        case 'pawn2' :
            row = i - 2
            col = j
            if(satisfy() && !cantMoveThrough(row,col)) getCircle(row,col)
        case 'pawn' :
            row = i - 1
            col = j
            if(satisfy() && !cantMoveThrough(row,col)) getCircle(row,col)
            if(i != 0) {
                if(j > 0 && checkTakeEnemy(i-1,j-1)) {
                    getCircle(i-1,j-1)
                } 
                if(j < w_boardWidth - 1 && checkTakeEnemy(i-1,j+1)) {
                    getCircle(i-1,j+1)
                }
            }
            break
        case 'rook' :
            rookBehavior()
            break
        case 'knight' :
            const narr = [[i+2,j-1],[i+2,j+1],[i+1,j-2],[i+1,j+2],[i-2,j-1],[i-2,j+1],[i-1,j-2],[i-1,j+2]]
            narr.forEach(pos => {
                if(pos[0] >= 0 && pos[0] < h_boardHeight && pos[1] >= 0 && pos[1] < w_boardWidth && !cantMoveThrough(pos[0],pos[1])) getCircle(pos[0],pos[1])
            })
            break
        case 'bishop' :
            bishopBehavior()
            break
        case 'queen' :
            rookBehavior()
            bishopBehavior()
            break
        case 'king' :
            for(row = i - 1; row <= i + 1; row++) {
                for(col = j - 1; col <= j + 1; col++) {
                    if(satisfy() && !cantMoveThrough(row,col)) getCircle(row,col)
                }
            }
            break
        default : skibidi()
    }
    if(circlePositions.length === 0) currentPiece = ''
    circlePositions.forEach(pos => {
        document.getElementById(`p${pos[0]}_${pos[1]}`).addEventListener('click', () => {
            if(isAnimating) return
            Moves++
            if(checkTakeEnemy(pos[0],pos[1])) {
                enemies = enemies.filter(enemy => !arrEqual(enemy, pos))
                console.log(`enemy taken at ${pos[0]} , ${pos[1]}`)
                board[pos[0]][pos[1]] = 0
                checkWin()
            }
            board[i][j] = 0
            board[pos[0]][pos[1]] = currentPiece
            checkGotKey([pos[0],pos[1]], pos)
            drawBoard()
            checkPromote(pos[0],pos[1])
            handleTeleport(pos[0],pos[1]) 
            currentPiece = ''
            requestAnimationFrame(checkGravity)
        })
    })
}

function getCircle(i,j) {
    const nextDiv = document.getElementById(`p${i}_${j}`)
    // const notGoToThis = ['untriggerblock']
    // || notGoToThis.includes(specialBoard[i][j])
    if(!nextDiv  || (specialBoard[i][j] === 'teleport' && checkPieceOnTeleport())) return
    const circleImg = new Image()
    circleImg.src = (checkTakeEnemy(i,j)) ? '../../image/circleRed.png' : '../../image/circle.png'
    circleImg.alt = 'movehere'
    circleImg.classList = 'circleImg'
    nextDiv.append(circleImg)
    circlePositions.push([i,j])
}

function checkGravity() {
    let movement = []
    isAnimating = true
    for(let i = h_boardHeight - 1; i >= 0; i--) {
        for(let j = w_boardWidth - 1; j >= 0; j--) {
            let current = board[i][j]
            let row = i + 1
            if(isChessPiece(current) && row < h_boardHeight) {
                let anim = false
                let seg = {
                    from: [i,j],
                    to: [],
                }
                current = board[row][j]
                for(; row < h_boardHeight; row++) {
                    if(solidStand(row,j)) break
                    seg.to = [row,j]
                    current = board[row][j]
                    checkGotKey([row,j],[row,j])
                    anim = true
                    if(specialBoard[row][j] === 'teleport') {
                        const arr = teleports.findNext([row,j])
                        if(!isChessPiece(board[arr[0]][arr[1]])) break
                    }
                }
                if(anim) {
                    for(let x = i + 1; x <= seg.to[0]; x++) {
                        const delay = animationDelay * (x - i)
                        setTimeout(() => { drawCell(x,j)}, delay)
                    }
                    movement.push(seg)
                    let temp = board[seg.from[0]][seg.from[1]]
                    board[seg.from[0]][seg.from[1]] = 0
                    board[seg.to[0]][seg.to[1]] = temp
                }
            }
        }
    }
    // console.log(movement)
    getAnimation(movement)
}
checkGravity()

function getAnimation(arr) {
    if(arr.length === 0) {
        isAnimating = false
        return
    }
    let maxDelay = 0
    arr.forEach(set => {
        const fromDiv = document.getElementById(`p${set.from[0]}_${set.from[1]}`)
        const toDiv = document.getElementById(`p${set.to[0]}_${set.to[1]}`)
        const delay = (set.to[0] - set.from[0]) * animationDelay
        maxDelay = Math.max(maxDelay,delay)
        // console.log(delay)
        if (fromDiv && toDiv && fromDiv.firstChild) { 
            const child = fromDiv.firstChild
            const toX = toDiv.offsetLeft - fromDiv.offsetLeft
            const toY = toDiv.offsetTop - fromDiv.offsetTop

            child.style.transition = `transform ${delay}ms ease-out`
            child.style.transform = `translate(${toX}px, ${toY}px)`

            setTimeout(() => {
                if(checkTakeEnemy(set.to[0],set.to[1])) {
                    enemies = enemies.filter(enemy => !arrEqual(enemy,set.to))
                    console.log(`enemy taken at ${set.to[0]} , ${set.to[1]}`)
                    checkWin()
                }
                toDiv.insertBefore(child, toDiv.firstChild)
                child.style.transform = 'none'
                child.style.transition = 'none'
                handleTeleport(set.to[0],set.to[1])
            }, delay)
        }
    })
    setTimeout(() => {
        drawBoard()
        isAnimating = false
    },maxDelay + 10)
}

function checkPromote(i,j) {
    if((board[i][j] === 'pawn' || board[i][j] === 'pawn2') && i === 0) {
        //ask for promote
        console.log('promote ? ')
        const screen = document.getElementById('promote')
        screen.style.opacity = 1
        screen.style.zIndex = 3
        const avail = document.getElementById('availablePiece')
        avail.innerHTML = 
        `
            <img src="../../image/eye.png" alt="hide" class="eye">
            <img src="../../image/bishop.png" alt="bishop">
            <img src="../../image/knight.png" alt="knight">
            <img src="../../image/queen.png" alt="queen">
            <img src="../../image/rook.png" alt="rook">
        `
        const eye = avail.querySelector('.eye')
        eye.addEventListener('mouseenter', () => {
            screen.style.opacity = 0.2
        })
        eye.addEventListener('mouseleave', () => {
            screen.style.opacity = 1
        })
        const children = avail.children;
        [...children].forEach(child => {
            child.addEventListener('click', () => {
                const chosenPiece = child.alt
                if(chosenPiece === 'hide') return
                console.log(` ===> ${chosenPiece}`)
                for(let k = 0; k < h_boardHeight; k++) {
                    if(board[i+k][j] === 'pawn' || board[i+k][j] === 'pawn2') {
                        board[i+k][j] = chosenPiece
                        break
                    }
                }
                screen.style.opacity = 0
                screen.style.zIndex = -2
                screen.style.transition = 'none'
                avail.innerHTML = ''
                drawBoard()
            })
        })
    }
}

function checkWin() {
    if(enemies.length > 0) return
    console.log('win')
    const id = levelIndex - 1
    setTimeout(() =>  {
        alert('you win!')
    }, 20)
    if(levelIndex) setTimeout(() => {
        const screen = document.getElementById('preventClick')
        let summary = `total moves: ${(games[id].leastMove === 0 || games[id].leastMove > Moves) ? `${Moves} (new highscore!)` : `${Moves} (highscore: ${games[id].leastMove})`}`
        screen.style.zIndex = 3
        screen.innerHTML = 
        `
        <div id="menu">
            <div class="inMenu title">Complete!</div>
            <div class="inMenu summary">${summary}</div>
            <div class="inMenu decision">
                ${(levelIndex > 1) ? `<div>
                    <div> previous </div>
                    <a href="../level/?${levelIndex - 1}"> <img src="../../image/prev.png" id="prev"> </a>
                </div>` : ''}
                <div>
                    <div> restart </div>
                    <a href="../level/?${levelIndex}"><img src="../../image/reset.png" id="restart"> </a>
                </div>
                ${(levelIndex < 25) ? `<div>
                    <div> next </div>
                    <a href="../level/?${levelIndex + 1}"><img src="../../image/next.png" id="next"> </a>
                </div>` : ''}
            </div>
        </div>
        `
        console.log(`current highscore: ${games[id].leastMove}, total move: ${Moves}`)
        games[id].leastMove = (games[id].leastMove) ? Math.min(games[id].leastMove, Moves) : Moves
        games[id].isDone = true
        if(id < 25 && games[id+5].isLock) {
            games[id+5].isLock = false
            alert(`unlock level ${id + 6}!`)
        }
        saveLevel()
    },500)
}

function checkOnpad() {
    for(let i = 0; i < h_boardHeight; i++) {
        for(let j = 0; j < w_boardWidth; j++) {
            if(isChessPiece(board[i][j]) && specialBoard[i][j] === 'pad') {
                specialBoard[i][j] = 'onpad'
            }
            if(!isChessPiece(board[i][j]) && specialBoard[i][j] === 'onpad') {
                specialBoard[i][j] = 'pad'
            }
        }
    }
    return specialBoard.flat(2).includes('onpad')
}

function checkGotKey(from, to) {
    if(!hasKey) return
    for(let i = from[0]; i <= to[0]; i++) {
        for(let j = from[1]; j <= to[1]; j++) {
            if(specialBoard[i][j] === 'key') {
                specialBoard[i][j] = 0
                // drawCell(i,j)
            }
            if(board[i][j] === 'enemy') {
                board[i][j]  = 0
            }
        }
    }
    if(!specialBoard.flat(2).includes('key')) {
        specialBoard = specialBoard.map(arr => arr.map(cell => {return (cell === 'lockblock') ? 0 : cell}))
        hasKey = false
        setTimeout(checkGravity,10)
    }
}

function handleTeleport(row,col) {
    if(specialBoard[row][col] != 'teleport' || !board[row][col]) return 
    const size = w_boardWidth * h_boardHeight
    let set = {
        from: [row,col],
        to: teleports.findNext([row,col])
    }
    const current = board[row][col]
    console.log(`move ${current} to ${set.to[0]} ${set.to[1]}`)
    if(set.to.length > 0 && !isChessPiece(board[set.to[0]][set.to[1]])) {
        const fromDiv = document.getElementById(`p${set.from[0]}_${set.from[1]}`)
        const toDiv = document.getElementById(`p${set.to[0]}_${set.to[1]}`)
        const child = fromDiv.firstChild
        board[set.from[0]][set.from[1]] = 0
        board[set.to[0]][set.to[1]] = current
        toDiv.insertBefore(child, toDiv.firstChild)
        checkPromote(set.to[0],set.to[1])
        drawCell(set.to[0],set.to[1])
        requestAnimationFrame(checkGravity)
        // drawCell(set.to)
        // drawBoard()
    }
}

function checkPieceOnTeleport() {
    for(let i = 0; i < h_boardHeight; i++) {
        for(let j = 0; j < w_boardWidth; j++) {
            if(isChessPiece(board[i][j]) && specialBoard[i][j] === 'teleport') {
                return true
            }
        }
    }
    return false
}
/* debug games */
// games = [
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['pawn'], [0], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['rook'], [0], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[], [], [], [], [], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['enemy'], [], [], [], [], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0]],
//             [[0], [0], ['knight'], [0], [0]],
//             [[0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], []],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], ['enemy'], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0]],
//             [['wall'], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0], [0], ['wall'], ['wall'], [0], [0]],
//             [[], [], [], ['wall'], [], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0]],
//             [[], [], ['wall'], ['wall'], [], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], ['wall']],
//             [[], [], [], ['wall'], [], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0]],
//             [['wall'], [], [], ['wall'], [], [], [], [], [], [], [], ['wall'], ['wall'], [], []],
//             [[], [], ['queen'], ['wall'], [], [], [], [], [], [], [], ['wall'], [], ['enemy'], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['rook'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['enemy']],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall']],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall'], ['wall']],
//             [['king'], [], [], [], [], [], [], [], [0], [0], ['wall'], ['wall'], ['wall']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], ['wall'], [], ['wall'], [], [], [], [], [], []],
//             [[], [], [], [], ['wall'], ['wall'], ['wall'], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], [], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['wall'], ['wall'], ['wall'], [0], [0], ['wall'], ['wall'], [0], ['wall'], [0], [0], [0], ['wall'], [0], [0]],
//             [['wall'], ['wall'], [0], [0], ['wall'], ['wall'], [0], ['wall'], ['wall'], ['wall'], [0], [0], ['wall'], ['wall'], [0]],
//             [['wall'], [0], [0], ['wall'], ['wall'], [0], ['wall'], ['wall'], [0], ['wall'], ['wall'], [0], [0], [0], ['wall']],
//             [[0], [0], ['wall'], ['wall'], [0], ['wall'], ['wall'], [0], [0], ['wall'], ['wall'], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], ['wall'], [0], [0], [0], [0], [0]],
//             [[], ['wall'], [], ['wall'], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], [], [], [], [], []],
//             [['wall'], ['wall'], ['wall'], ['wall'], [], [], ['wall'], ['bishop'], ['wall'], [], ['wall'], [], [], ['wall'], []],
//             [[], [], [], [], [], [], [], ['wall'], [], ['wall'], [], [], [], ['wall'], []],
//             [['wall'], ['wall'], ['wall'], [], [], [], [], [0], ['wall'], [], ['wall'], [], ['wall'], ['wall'], []],
//             [[], [], ['wall'], ['wall'], [], [], [], ['wall'], [], ['wall'], [], ['wall'], ['wall'], [], ['wall']],
//             [[], [], [], ['wall'], ['wall'], [], [], [], [], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], []],
//             [[0], ['wall'], [], [], ['wall'], ['wall'], [], ['wall'], [], ['wall'], ['enemy'], [], [], ['wall'], []],
//             [[], ['wall'], [], [], [], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], [], [], [], ['wall']],
//             [[], ['wall'], [], [], [], [], [], ['wall'], ['wall'], [], [], [], [], ['wall'], ['wall']],
//             [['wall'], ['wall'], ['wall'], [], [], [], [], ['wall'], [], [], [], [], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], ['enemy']],
//             [[0], [0], [0], [0], [0], [0], [0], [0], ['wall'], ['wall']],
//             [['knight'], [0], [0], ['wall'], [0], [0], [0], ['wall'], ['wall'], ['wall']],
//             [['king'], [0], [0], ['wall'], [0], [0], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['bishop'], ['wall'], [0], ['wall'], [0], [0], ['wall'], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['enemy'], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], ['knight'], [0], [0]],
//             [['wall'], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], ['wall'], [0], [0], [0], [0], [0], [0], ['wall'], [0], ['knight'], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[], [], [], [], ['wall'], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0]],
//             [[], [], [], [], ['wall'], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0]],
//             [[], [], [], [], ['wall'], ['wall'], [0], [0], ['wall'], [0], [0], [0], [0], [0]]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], ['king']],
//             [['pedestal'], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], ['wall']],
//             [['pedestal'], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], [0]],
//             [['pawn2'], [0], [0], [0], [0], [0], [0], [0], ['wall'], ['wall'], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], ['wall'], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], ['wall']],
//             [['wall'], [], [], [], [], [0], [0], [0], ['wall'], [0], [0]],
//             [['enemy'], [], [], [], [], ['wall'], [], [0], ['wall'], ['wall'], []],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], [0], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], ['wall'], ['wall'], [0], [0], ['wall'], ['enemy'], ['wall'], ['queen'], ['wall'], ['wall'], ['wall'], ['queen'], ['wall']],
//             [[0], [0], [0], [0], ['wall'], [0], ['wall'], ['wall'], ['pedestal'], ['wall'], ['queen'], ['queen'], ['queen'], ['wall'], ['queen'], ['wall']],
//             [[0], [0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], ['wall'], ['queen'], ['wall'], ['wall'], ['wall'], ['queen'], ['wall']],
//             [[0], [0], ['pedestal'], [0], ['wall'], [0], [0], ['wall'], [0], ['wall'], ['queen'], ['wall'], ['queen'], ['wall'], ['queen'], ['wall']],
//             [['pedestal', 'rook'], ['pedestal'], ['pedestal'], [0], ['wall'], ['wall'], [0], ['wall'], [0], ['wall'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['wall']],
//             [[], [], ['pedestal'], [], [], [0], ['pedestal'], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], [], [], [], [], [], [], [], [0], ['bishop'], [0], [0]],
//             [[], [], [], [], [0], [], [], ['wall'], ['wall'], ['wall'], [], [], [0], [0], [0], [0]],
//             [[], [0], [0], [], [0], [], [], ['wall'], [], ['wall'], [], [], [0], [0], [0], [0]],
//             [[], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], [0], ['bishop'], [0], [], [], [0], [0], [0], [0]],
//             [[], [], [], [], ['wall'], [], [], ['wall'], ['king'], ['wall'], [], [], [0], [0], [0], ['pedestal']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], [], [], [], [], [], [0], [], [0], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [0], [], [0], [], [], [], [], []],
//             [[], [], [], [], [], [], [], ['bishop'], [], [0], [], [], [], [], []],
//             [[], [], [], [], [], [], [], ['bishop'], [], [0], [], [], [], [], []],
//             [['wall'], ['wall'], ['wall'], ['wall'], [], [], [], ['king'], [], [0], [], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['enemy'], [], [], [], [], [], [], ['bishop'], [], [0], [], [], [], [], ['enemy']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [], [], ['bishop'], [], [0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], ['wall'], [], [], ['bishop'], [], [0], ['wall'], [], [], [], []],
//             [[], [], [], [], ['wall'], [], [], ['bishop'], [], [0], ['wall'], [], [], [], []],
//             [[], [], [], [], ['wall'], [], [], ['bishop'], [], [0], ['wall'], [], [], [], []],
//             [[], [], [], [], ['wall'], [0], [], ['bishop'], [], [0], ['wall'], [], [], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], [], [], [], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[0], ['wall'], [], [], [], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], [], [], ['enemy'], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], [], [], ['wall'], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], [], [], [], [0], ['wall'], ['wall'], [0]],
//             [[0], ['wall'], ['wall'], [], [], [0], [0], ['wall'], [0]],
//             [[], ['wall'], [], [], [], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], [], [], [], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], [], [0], ['knight'], [], [], ['wall'], []],
//             [[0], ['wall'], [], ['knight'], ['knight'], ['knight'], [], ['wall'], []],
//             [[], ['wall'], ['knight'], ['knight'], ['knight'], ['knight'], ['knight'], ['wall'], []],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], [], [], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], [], [], [], [], [], [], [], [], []],
//             [[0], [], [], [], [], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], []],
//             [['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen']],
//             [['queen'], ['wall'], ['wall'], ['wall'], ['queen'], ['wall'], ['wall'], ['queen'], ['queen'], ['wall'], ['queen']],
//             [['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen']],
//             [['queen'], ['pedestal', 'queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['wall'], ['queen'], ['queen']],
//             [['pedestal', 'queen'], ['queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['queen'], ['wall'], ['queen'], ['queen'], ['queen'], ['queen'], ['queen']],
//             [['pedestal', 'queen'], ['wall'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['wall'], ['queen'], ['queen'], ['wall'], ['queen'], ['queen'], ['queen']],
//             [['pedestal', 'queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['queen'], ['wall'], ['queen'], ['wall'], ['wall'], ['wall']],
//             [['knight'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['pedestal', 'queen'], ['queen'], ['queen'], ['queen'], ['queen'], ['wall'], ['enemy']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], ['wall'], ['key'], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['pedestal'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['pedestal'], [0], [0], ['wall'], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['pawn2'], [0], [0], ['wall'], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['wall'], [0], [0], [0], [0], ['wall'], [0], [0], [0], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], ['pawn2'], [0], [0], ['wall'], ['lockblock'], ['lockblock'], ['lockblock']],
//             [[], [], [], [], [], ['pawn2'], [0], [0], ['wall'], ['lockblock'], [0], [0]],
//             [[], [], [], [], [], ['pawn2'], [0], [0], ['wall'], ['lockblock'], [0], ['enemy']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         limit: 65,
//         coin: 10,
//         level:  [
//             [['enemy'], ['enemy'], ['enemy'], ['enemy'], ['enemy'], ['enemy'], ['enemy'], ['enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']],
//             [['pedestal', 'knight'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy'], ['pedestal', 'enemy']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['key'], ['key'], [0], [0], ['key'], ['key'], ['key'], ['key'], ['key'], ['key'], [0], ['key']],
//             [[], [], [], [], [], [], [], [], [0], ['lockblock'], ['lockblock'], ['lockblock']],
//             [[], [], [], [], [], [], [], [], [0], ['lockblock'], [0], ['lockblock']],
//             [[], [], [], [], [], [], ['wall'], [], [0], ['lockblock'], ['king'], ['lockblock']],
//             [[], [], [], [], [], [0], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['wall'], [], [], [], ['wall'], [], ['wall'], [], [0], [0], [0], [0]],
//             [['wall'], ['pedestal'], ['pedestal'], ['pedestal'], ['wall'], ['pedestal'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['wall'], [], [], [], ['wall'], [0], [0], [0], ['wall'], ['knight'], ['wall'], ['enemy']],
//             [['wall'], [], [], [], ['wall'], ['pedestal'], [], [], ['wall'], ['wall'], ['wall'], ['pedestal']],
//             [['wall'], ['pedestal'], ['pedestal'], ['pedestal'], ['wall'], [], [], [0], [0], ['wall'], ['wall'], ['pedestal']],
//             [['wall'], [0], [0], [0], ['wall'], [], [], [0], [0], [], [], ['wall']],
//             [['wall'], ['bishop'], [], [], ['wall'], [0], [0], [0], [0], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['enemy'], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0]],
//             [[0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0]],
//             [['pedestal'], [], [], [], [], [0]],
//             [['bishop'], ['knight'], ['rook'], ['king'], ['queen'], ['pawn2']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['wall'], ['wall'], ['wall'], ['king'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall']],
//             [['wall'], ['wall'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall']],
//             [['wall'], ['wall'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['wall']],
//             [['wall'], ['wall'], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], ['enemy'], ['wall']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['wall'], [], [], [], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], [0], [0], [0]],
//             [['wall'], [], [], [], ['wall'], ['wall'], [0], ['wall'], [0], ['wall'], [0], ['wall'], ['wall'], [0], [0], [0]],
//             [['wall'], [], [], [], [], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['wall'], [], ['pedestal'], [], ['wall'], [0], [0], [0], [0], [0], [0], [0], ['wall'], [0], ['pedestal'], [0]],
//             [['wall'], [], [], [], [], ['wall'], [0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0]],
//             [['wall'], [0], [0], [0], [0], [0], [0], ['rook'], [0], ['queen'], [0], [0], [0], [0], [0], [0]]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//             [['rook'], ['triggerblock'], [], ['untriggerblock'], [], ['triggerblock'], [], ['untriggerblock'], [], ['triggerblock'], [], ['untriggerblock'], [], ['triggerblock'], [], ['enemy']],
//             [['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [0], ['wall'], [0], ['wall'], [], ['wall'], ['wall']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], ['wall'], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
//             [[0], ['wall'], [0], [], [], [], [], [], [], [], [], [], [], [], [], []],
//             [[0], ['wall'], ['wall'], [0], ['wall'], [0], [], [], [], [], [], [], [], [], [], []],
//             [['pad'], ['wall'], [0], [], [], [0], [0], [], [], [], [], [], [], [], [], []],
//             [['wall'], ['wall'], [0], [0], [0], ['wall'], [], [0], [0], [], [], [], [], [], [], []],
//             [[0], [], [0], [0], [0], [], [], [0], [], [], [], [], [], [], [], []],
//             [[], [], ['knight'], [], ['wall'], [], [], [], [], [], [], [], [], [], [], []]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['wall'], ['wall'], ['key'], [], [], [], ['wall'], ['wall'], [], [0], [0], [0], [0], [0]],
//             [[], [], ['wall'], ['wall'], ['wall'], [0], ['wall'], ['wall'], ['pawn2'], [0], [0], [0], ['wall'], [0]],
//             [[], [], [], [], [], [0], ['wall'], ['wall'], ['wall'], [0], [0], [0], ['wall'], [0]],
//             [['wall'], ['wall'], ['wall'], [0], ['wall'], ['wall'], ['wall'], ['wall'], [], [0], [0], ['wall'], ['wall'], [0]],
//             [[], [], [], [], [], [], ['wall'], ['wall'], [], [0], ['wall'], ['wall'], ['wall'], [0]],
//             [['bishop'], [], [], [0], [0], [0], ['wall'], ['wall'], [0], [0], [0], [0], ['wall'], ['key']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], ['key'], ['wall'], ['wall'], [], [0], [0], [0], ['wall'], [0]],
//             [[0], [], [], [], [0], [], ['wall'], ['wall'], [], [0], [0], [0], ['wall'], [0]],
//             [[0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [], [], [0], [0], ['wall'], [0]],
//             [[], [], [], [0], [0], [], ['wall'], ['wall'], ['rook'], [], [0], [0], ['wall'], ['lockblock']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['lockblock'], ['lockblock'], ['lockblock'], ['lockblock'], ['lockblock'], ['lockblock']],
//             [['knight'], [], [], [], [], [], ['wall'], ['wall'], [], [], [], ['wall'], ['lockblock'], ['enemy']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['queen'], [0], [0], [0], ['teleport'], ['wall'], [0], [0], [0], [0], [0], [0], ['wall'], ['teleport']],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], [0], [0], [0], [0], ['wall'], [0]],
//             [[0], [0], [0], [0], [0], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0]],
//             [[0], [0], [0], [0], [0], ['wall'], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], ['wall'], ['teleport'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [[], [], [], [], [], ['wall'], [0], ['wall'], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['teleport'], [], [], [], [], [0], [0], [0], [0], [0], [0], [0], [0], ['enemy']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0], [0], [0]],
//             [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
//             [['wall'], ['wall'], [], [], [], [0], [0], ['wall'], ['wall'], [0], [0], [0]],
//             [[], ['wall'], [], [], [], [0], [0], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], [], [], [], [0], [0], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], [], [], [], [], [0], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['bishop'], ['wall'], [0], [0], [0], [0]],
//             [[], ['wall'], ['bishop'], ['bishop'], ['king'], ['bishop'], ['bishop'], ['wall'], [0], ['enemy'], [0], [0]]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], [], [], [], [], [], [], [], [], [], []],
//             [['pedestal', 'rook'], ['wall'], [0], [0], [0], [0], [0], [0], [0], [0], ['pedestal'], []],
//             [['pedestal'], ['wall'], [], [], [], [], [], [], [], [], [], []],
//             [['pawn2'], ['wall'], [], [], [], [], [], [], [], [], [], []],
//             [['wall'], ['wall'], [], [], [], [], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], [], []],
//             [[], [], [], [], [], [], [], [], [], [], [], []],
//             [['wall'], ['wall'], [], [], [], [], [], [], [], [], [], []],
//             [['wall'], ['wall'], [], [], [], [], [], [], [], [], [], []],
//             [['enemy'], ['lockblock'], ['key'], [], ['key'], [], ['key'], [], ['key'], [], ['key'], []],
//             [['wall'], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall']],
//             [['wall'], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall']],
//             [['wall'], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], ['wall'], [], [], ['key'], ['wall'], ['lockblock'], ['wall'], ['wall'], ['lockblock'], ['wall'], [0], [0], ['triggerblock'], [0]],
//             [['pedestal'], ['pedestal'], ['wall'], [], ['wall'], ['wall'], ['wall'], ['pedestal'], ['wall'], ['wall'], ['pedestal'], ['wall'], ['wall'], [0], ['pedestal'], [0]],
//             [['pawn2'], ['pawn2'], ['wall'], [], [], ['wall'], [], ['pawn2'], ['wall'], ['wall'], ['pawn2'], ['wall'], [0], [0], ['pawn2'], [0]],
//             [['pedestal'], ['pedestal'], [], ['wall'], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], ['pedestal'], ['wall'], [0], [0], ['wall'], [0]],
//             [[], [0], [0], ['wall'], ['wall'], ['wall'], [0], [0], ['wall'], ['wall'], [], ['wall'], ['wall'], [0], ['wall'], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], [0], ['wall'], [0], [], ['wall'], [], [], [], ['wall'], ['enemy'], ['wall'], [0]],
//             [[0], [0], [0], ['wall'], ['wall'], ['wall'], [], [], ['wall'], ['wall'], [], ['wall'], ['wall'], ['wall'], [0], [0]],
//             [[], [], [], ['wall'], [0], [0], [], [], [], [], [], [], ['wall'], ['wall'], ['wall'], [0]],
//             [[], ['pad'], [0], ['wall'], [0], [0], [], [], [], [], [], [], ['wall'], ['wall'], ['wall'], [0]],
//             [['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [[], [], ['teleport'], [], ['teleport'], [], ['teleport'], [], ['teleport'], [], ['wall'], [], [0]],
//             [[], [], [], [], [], [], [], [], [], [], ['wall'], [], [0]],
//             [[], [], [], [], [], [], [], [], ['wall'], [], ['wall'], [], [0]],
//             [[], [], [], [], [], [], [], [], ['wall'], [], ['wall'], [], [0]],
//             [[], [], [], [], [], [], ['wall'], [], ['wall'], [], ['wall'], [], [0]],
//             [[], [], [], [], [], [], ['wall'], [], ['wall'], [], ['wall'], [], [0]],
//             [[], [], [], [], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], [], [0]],
//             [[], [], [], [], ['wall'], [], ['wall'], ['teleport'], ['wall'], [], ['wall'], [], [0]],
//             [['knight'], [], ['wall'], [], ['wall'], ['teleport'], ['wall'], [], ['wall'], [], ['wall'], [], [0]],
//             [['knight'], [], ['wall'], ['teleport'], ['wall'], [], ['wall'], [], ['wall'], [], ['wall'], ['enemy'], [0]]
//             ],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [['teleport'], ['knight'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock']],
//             [['triggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock']],
//             [['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock']],
//             [['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock']],
//             [['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['lockblock'], ['lockblock']],
//             [['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['triggerblock'], ['lockblock'], ['key']],
//             [['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['triggerblock'], ['untriggerblock'], ['untriggerblock'], ['untriggerblock'], ['wall'], ['wall'], ['wall'], ['wall']],
//             [['wall'], ['wall'], ['triggerblock'], ['triggerblock'], ['triggerblock'], ['triggerblock'], ['triggerblock'], ['wall'], ['wall'], ['enemy'], ['wall']],
//             [['wall'], ['wall'], ['wall'], ['untriggerblock'], ['untriggerblock'], ['untriggerblock'], ['untriggerblock'], ['wall'], ['lockblock'], ['wall'], ['wall']],
//             [['teleport'], ['pad'], ['wall'], ['wall'], [0], [0], [0], [0], ['wall'], ['wall'], ['wall']],
//             [['queen'], ['wall'], ['wall'], ['wall'], ['wall'], ['pad'], ['wall'], ['pad'], ['wall'], ['wall'], ['wall']]
//             ],
//     },
//     {
//         message: 'custom level',
//         level:  [
//             [[0],[0],[0],[0],[0]],
//             [[0],[0],[0],[0],[0]],
//             [[0],[0],[0],[0],[0]],
//             [[0],[0],[0],[0],[0]],
//             [[0],[0],[0],[0],[0]]
//         ]
//     }
// ]
// saveLevel()