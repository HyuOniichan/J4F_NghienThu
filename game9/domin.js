const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')
//width,height of normal gamemode : 15 x 18 
const container = document.getElementById('container')
let c_width = container.style.width
let c_height = container.style.height
c_width = '600px'
c_height = '420px'
//default option contain
let OCcanvas = document.getElementById('optionContainer')
OCcanvas.style.width = c_width
//default square color
let c_evenSquareColor = 'lightblue'
let c_oddSquareColor = 'aliceblue'
//default square size
let s_squareSize = 30
//default difficult
let d_playOnDifficult = 'medium'
//default field
let rows = parseInt(c_width) /s_squareSize
let cols = parseInt(c_height) / s_squareSize
let field = new Array(rows).fill().map(() => new Array(cols).fill(0))
let TFfield = new Array(rows).fill().map(() => new Array(cols).fill(false))
//default bar 
const bar = document.getElementById('difficult')
bar.addEventListener('change',(event) => {
    const difficult = event.target.value
    getNewCanvas(difficult)
})
//get new canvas by change option
let flags = 40
function getNewCanvas(difficult){
    switch(difficult){
        case 'easy' :
            flags = 20
            s_squareSize = 33
            c_height = '396px'
            c_width = '396px'
            break
        case 'medium' :
            flags = 40
            s_squareSize = 30
            c_height = '420px'
            c_width = '600px'
            break
        case 'hard' :
            flags = 99
            s_squareSize = 25
            c_height = '500px'
            c_width = '600px'
            break
        case 'impossible' :
            flags = 210
            s_squareSize = 15
            c_height = '630px'
            c_width = '1035px'
            break
        case 'yourMom' :
            console.log('handle your mom')
            alert('your mum fat')
            bar.remove(4)
            bar.value = d_playOnDifficult
            bar.style.backgroundColor = 'darkblue'
            bar.style.color = 'white'
            document.body.style.backgroundColor = 'darkred'
            break
    }
    if(difficult != 'yourMom'){
        cols = parseInt(c_width) / s_squareSize;
        rows = parseInt(c_height) / s_squareSize;   
        canvas.width = parseInt(c_width) 
        canvas.height = parseInt(c_height)
        OCcanvas.style.width = c_width
        d_playOnDifficult = difficult
        firstClick = true
        setTimeout(drawCanvas,10)
    }
    console.log(d_playOnDifficult)
}
//fill square function 
function fillHere(arr, color, size) {
    ctx.fillStyle = color;
    ctx.fillRect(arr[1] * size, arr[0] * size, size, size);
}
//fill text function
function drawText(arr, color, text) {
    ctx.font = '24px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, arr[1] * s_squareSize + s_squareSize / 2, arr[0] * s_squareSize + s_squareSize / 2);
}
//draw canvas 
function drawCanvas(){
    const cols = parseInt(c_width) 
    const rows = parseInt(c_height)
    canvas.width = cols
    canvas.height = rows
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < rows / s_squareSize; i++){
        for(let j = 0; j < cols / s_squareSize; j++){
            fillHere([i,j],((i + j) % 2 === 0) ? c_evenSquareColor : c_oddSquareColor,s_squareSize)
            if(TFfield[i][j]){
                const defaultOpacity = ctx.globalAlpha
                ctx.globalAlpha = 0.7
                fillHere([i,j],'bisque',s_squareSize)
                ctx.globalAlpha = 1.0
                if(field[i][j] > 0){
                    const color = colorPalette[field[i][j] - 1]
                    drawText([i,j],color,`${field[i][j]}`)
                }
                ctx.globalAlpha = defaultOpacity
            }
        }
    }
}
drawCanvas()
// color palette base on numbers
const colorPalette = [
    '#005792',
    '#42b883',
    '#e46161',
    '#a393eb',
    '#f8da5b',
    '#ff347f',
    '#f96d00',
    '#adf7d1'
]
//get mouse move then light the square that under it
let p_getMousePosition = []
canvas.addEventListener('mousemove', (event) => {
    p_MouseIsOnCanvas = true
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left 
    const mouseY = event.clientY - rect.top  
    const offset = -2.5 //for the mouse head

    const cell = [Math.floor((mouseY + offset)/ s_squareSize),Math.floor((mouseX + offset) / s_squareSize)]
    p_getMousePosition = cell
    drawCanvas()
    ctx.globalAlpha = 0.8
    fillHere(cell,'gray',s_squareSize)
    ctx.globalAlpha = 1.0
});
//check if mouse is in the canvas or not
let p_MouseIsOnCanvas = false
canvas.addEventListener('mouseout', () => {
    p_MouseIsOnCanvas = false
})

function getNewField(){
    cols = parseInt(c_width) /s_squareSize
    rows = parseInt(c_height) / s_squareSize
    field = new Array(rows).fill().map(() => new Array(cols).fill(0))
    TFfield = new Array(rows).fill().map(() => new Array(cols).fill(false))
    let amountOfFlags = flags
    console.log(`flags: ${amountOfFlags}`)
    convertFirstClick()
    while(amountOfFlags > 0){
        let newPos = Math.floor(Math.random() * cols * rows)
        while(true){
            const r = Math.floor(newPos / cols) %  rows
            const c = newPos % cols
            if(field[r][c] === 0){
                field[r][c] = -1 // -1 = bomb
                amountOfFlags--
                break
            }
            else{
                newPos+=7
            }
        }
    }
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(field[i][j] != -1 ) field[i][j] = checkAround(i,j)
        }
    }
    console.log(field)
}
//get bomb around
function checkAround(x,y){
    let bombs = 0
    for(let i = -1; i <=1 ; i++){
        if(x + i >= 0 && x + i < rows){
            for(let j = -1; j <= 1; j++){
                if(y + j >= 0 && y + j < cols){
                    if(field[x+i][y+j] === -1) bombs++
                }
            }
        }
    }
    return bombs
}
//get first click/tap to create new field
let firstClick = true
let f_firstPosClick = [0,0]
function initialClick(){
    getNewField()
    console.log(`first click at ${f_firstPosClick}`)
}
function convertFirstClick(){
    const x = f_firstPosClick[0]
    const y = f_firstPosClick[1]
    for(let i = -1; i <=1 ; i++){
        if(x + i >= 0 && x + i < rows){
            for(let j = -1; j <= 1; j++){
                if(y + j >= 0 && y + j < cols){
                    field[x+i][y+j] = 9
                }
            }
        }
    }
}
canvas.addEventListener('click', () => {
    if(firstClick){
        const i = p_getMousePosition[0]
        const j = p_getMousePosition[1]     
        f_firstPosClick = p_getMousePosition
        firstClick = false
        initialClick()
        revealCell(i,j)
        requestAnimationFrame(drawCanvas)
        setTimeout(console.log(TFfield),10)
    }
    else if(p_MouseIsOnCanvas){
        f_firstPosClick = p_getMousePosition
        handleClickCell()
    }
})
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if(!firstClick && p_MouseIsOnCanvas){
        handlePutFlag()
    }
})
//handle click cell
function handleClickCell(){
    const i = p_getMousePosition[0]
    const j = p_getMousePosition[1]
    if(!TFfield[i][j]){
        if(field[i][j] === -1){
            //lose logic here
            console.log('you lose')
        }
        else {
            console.log(`${i},${j}`)
            revealCell(i,j)
            requestAnimationFrame(drawCanvas)
        }
    }
}

//handle put flag
function handlePutFlag(){
    const i = p_getMousePosition[0];
    const j = p_getMousePosition[1];
    if(!TFfield[i][j]){
        TFfield[i][j] = true;
        drawCanvas();
    } else {
        TFfield[i][j] = false;
        drawCanvas();
    }
}

//handle all cells can be open
function revealCell(i,j){
    if(i < 0 || i >= rows || j < 0 || j >= cols) return
    else if(field[i][j] === -1 || TFfield[i][j]) return
    else{
        TFfield[i][j] = true
        if(field[i][j] === 0){
            for(let x = -1; x <= 1; x++){
                for(let y = -1; y <= 1; y++){
                    revealCell(i + x, j + y)
                }
            }
        }
    }
}