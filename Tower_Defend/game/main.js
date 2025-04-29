/* import here */
import { Draggable, Droppable } from "./dragdrop.js" // for drag drop objects
import { Functions } from "./functions.js"




/*...*/
/* get level informations */
// const gameInfos = Object.fromEntries(
//     new URL(window.location.href).search.slice(1)
//         .split('&')
//         .map(str => str.split('='))
// )
// console.log(gameInfos) //should contain level, rounds
/* initial value */
import { FieldInfo } from "./info.js"



/* field */
const field = document.getElementById('field')
const SquareSize = 55
field.style.height = `${SquareSize * 11}px`
field.style.width = `${SquareSize * 22}px`
// const arr = Array.from({length: FieldInfo.row} , () => new Array(FieldInfo.col).fill(0))
// console.log(JSON.stringify(arr).split('],[').join('],\n['))
const board = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]
const represent = [0,'wall']
const path = Functions.findShortestPath(FieldInfo.start, FieldInfo.end, board)
console.log(path)
//build row and col
function drawBoard() {
    Functions.skibidi()
    if(!board[0]) return console.log("board cannot render:", board)
    field.innerHTML = ''
    const row = board.length
    const col = board[0].length
    for(let i = 0; i < row; i++) {
        const rowDiv = document.createElement('div')
        rowDiv.classList = 'rowDiv'
        for(let j = 0; j < col; j++) {
            const newDiv = document.createElement('div')
            newDiv.id = `${i}-${j}`
            newDiv.style.height = `${SquareSize}px`
            newDiv.style.width = `${SquareSize}px`
            if(board[i][j]) newDiv.innerHTML = `<div class="cell"><img src="../image/${represent[board[i][j]]}.png" alt=${represent[board[i][j]]} class="img"></div>`
            rowDiv.append(newDiv)
        }
        field.append(rowDiv)
    }
}
drawBoard()