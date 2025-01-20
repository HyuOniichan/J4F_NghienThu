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
// starting move
let Moves = 0
//default check on pad
let onPad = false
//default has key in board
let hasKey = true
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
/* get all enemies position */
let enemies = []
for(let i = 0; i < h_boardHeight; i++) {
    for(let j = 0; j < w_boardWidth; j++) {
        if(board[i][j] === 'enemy') enemies.push([i,j])
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
    if(hasKey) {checkGotKey()}
    if(isChange) console.log(`pad is trigger to ${onPad}`)
    for(let i = 0; i < h_boardHeight; i++) {
        const childDiv = document.createElement('div')
        childDiv.classList = 'rowDiv'
        for(let j = 0; j < w_boardWidth; j++) {
            const color = ((i + j) % 2) ? oddCellColor : evenCellColor
            const newDiv = document.createElement('div')
            newDiv.style.width = `${s_squareSize}px`
            newDiv.style.height = `${s_squareSize}px`
            newDiv.style.backgroundColor = color
            newDiv.id = `p${i}${j}`
            if(board[i][j]) {
                newDiv.innerHTML = `<div class="cell"><img src="../../image/${board[i][j]}.png" alt="${board[i][j]}" class="chessImg${isChessPiece(board[i][j]) ? '' : '2'}"></div> `
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
                extraDiv.classList = 'cell'
                extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
                newDiv.append(extraDiv)
            }
            if(specialBoard[i][j]) {
                if((specialBoard[i][j] === 'triggerblock' || specialBoard[i][j] === 'untriggerblock') && isChange) {
                    specialBoard[i][j] = (specialBoard[i][j] === 'triggerblock') ? 'untriggerblock' : 'triggerblock'
                }
                const ex = specialBoard[i][j]
                const extraDiv = document.createElement('div')
                extraDiv.classList = 'cell'
                extraDiv.innerHTML = `<img src="../../image/${ex}.png" alt="${ex}" class="chessImg2"> `
                newDiv.append(extraDiv)
            }
            childDiv.append(newDiv)
        }
        divBoard.append(childDiv)
    }
}
drawBoard()
/* handle click on piece */
let currentPiece = ''
let circlePositions = []
let isAnimating = false
function handlePieceClick(i,j) {
    const piece = board[i][j]
    if(!isChessPiece(piece)) return
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
            getCircle(i - 2,j)
        case 'pawn' :
            getCircle(i - 1,j)
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
                if(pos[0] >= 0 && pos[0] < h_boardHeight && pos[1] >= 0 && pos[1] < w_boardWidth && cantMoveThrough(pos[0],pos[1])) return
                getCircle(pos[0],pos[1])
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
        document.getElementById(`p${pos[0]}${pos[1]}`).addEventListener('click', () => {
            if(isAnimating) return
            isAnimating = true
            Moves++
            if(checkTakeEnemy(pos[0],pos[1])) {
                enemies = enemies.filter(enemy => !arrEqual(enemy, pos))
                console.log(`enemy taken at ${pos[0]} , ${pos[1]}`)
                board[pos[0]][pos[1]] = 0
                checkWin()
            }
            board[i][j] = 0
            board[pos[0]][pos[1]] = currentPiece
            drawBoard()
            checkPromote(pos[0],pos[1])
            handleTeleport(pos[0],pos[1]) 
            currentPiece = ''
            requestAnimationFrame(checkGravity)
        })
    })
}

function getCircle(i,j) {
    const nextDiv = document.getElementById(`p${i}${j}`)
    const notGoToThis = ['untriggerblock']
    if(!nextDiv || notGoToThis.includes(specialBoard[i][j])) return
    const circleImg = new Image()
    circleImg.src = (checkTakeEnemy(i,j)) ? '../../image/circleRed.png' : '../../image/circle.png'
    circleImg.alt = 'movehere'
    circleImg.classList = 'circleImg'
    nextDiv.append(circleImg)
    circlePositions.push([i,j])
}

function checkGravity() {
    let movement = []
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
                while(!solidStand(row,j)) {
                    anim = true
                    seg.to = [row,j]
                    row++
                    if(row >= h_boardHeight) break
                    current = board[row][j]
                }
                if(anim) {
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
        const fromDiv = document.getElementById(`p${set.from[0]}${set.from[1]}`)
        const toDiv = document.getElementById(`p${set.to[0]}${set.to[1]}`)
        const delay = (set.to[0] - set.from[0]) * 123
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
                toDiv.appendChild(child)
                child.style.transform = 'none'
                child.style.transition = 'none'
            }, delay)
        }
    })
    setTimeout(() => {
        drawBoard()
        isAnimating = false
    },maxDelay)
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

function checkGotKey() {
    for(let i = 0; i < h_boardHeight; i++) {
        for(let j = 0; j < w_boardWidth; j++) {
            if(isChessPiece(board[i][j]) && specialBoard[i][j] === 'key') {
                specialBoard[i][j] = 0
                console.log('key taken!')
                specialBoard = specialBoard.map(arr => arr.map(cell => {return (cell === 'lockblock') ? 0 : cell}))
                hasKey = false
                setTimeout(checkGravity,10)
                console.log(specialBoard)
                return
            }
        }
    }
}

function handleTeleport(row,col) {
    if(specialBoard[row][col] != 'teleport' || !board[row][col]) return 
    const size = w_boardWidth * h_boardHeight
    let set = {
        from: [row,col],
        to: []
    }
    // console.log(`max Width: ${w_boardWidth}, max Height: ${h_boardHeight}, current piece: ${currentPiece}`)
    for(let p = row * w_boardWidth + col + 1; p < size * 2; p++) {
        const i = Math.floor((p % size) / w_boardWidth)
        const j = (p % size) % w_boardWidth
        if(specialBoard[i][j] === 'teleport') {
            set.to = [i,j]
            break
        }
    }
    if(set.to.length  > 0) {
        const fromDiv = document.getElementById(`p${set.from[0]}${set.from[1]}`)
        const toDiv = document.getElementById(`p${set.to[0]}${set.to[1]}`)
        const child = fromDiv.firstChild
        board[set.from[0]][set.from[1]] = 0
        board[set.to[0]][set.to[1]] = currentPiece
        toDiv.insertBefore(child, toDiv.firstChild)
    }
}
/* debug games */
// games = [
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 0],
//             ['pawn2', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 0],
//             ['rook', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'wall', 0, 0, 0, 0],
//             ['wall','wall', 0, 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 0, 'wall', 'wall', 'wall'],
//             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             ['enemy', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             ['wall', 'wall', 0, 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
//             ],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: false,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         isDone: false,
//         isLock: true,
//         leastMove: 0,
//         coin: 10,
//         level:  [],
//     },
//     {
//         message: 'custom level',
//         level: [[[0]]],
//     }
// ]
// saveLevel()