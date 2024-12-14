const canvas = document.getElementById('field')
const ctx =  canvas.getContext('2d')
//width,height of normal gamemode : 15 x 18 
const container = document.getElementById('container')
let c_width = container.style.width
let c_height = container.style.height
c_width = '600px'
c_height = '420px'
//default image source
const i_flagSource = './image/flag.png'
const i_bombSource = './image/bomb.png'
//default option contain
const OCcanvas = document.getElementById('optionContainer')
OCcanvas.style.width = c_width
//default square color
let c_evenSquareColor = 'lightblue'
let c_oddSquareColor = 'aliceblue'
//default square size
let s_squareSize = 30
//default font size
let s_FontSize = 24
//default difficult
let d_playOnDifficult = 'medium'
//default show bomb delay
let t_delayTimeShowBomb = 100
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
//default time
const t_timePass = document.getElementById('time')
let t_time = 0
let timeInterval
//default win lose
let lose = false
let win = false
//default flag
const q_flagQuantity = document.getElementById('numflag')
let flags = 40
let tempFlag = flags
let flagInterval
//get new canvas by change option
function getNewCanvas(difficult){
    switch(difficult){
        case 'easy' :
            flags = 10
            s_squareSize = 33
            s_FontSize = 28
            t_delayTimeShowBomb = 160
            c_height = '396px'
            c_width = '396px'
            break
        case 'medium' :
            flags = 40
            s_squareSize = 30
            s_FontSize = 24
            t_delayTimeShowBomb = 100
            c_height = '420px'
            c_width = '600px'
            break
        case 'hard' :
            flags = 99
            s_squareSize = 25
            s_FontSize = 20
            t_delayTimeShowBomb = 70
            c_height = '500px'
            c_width = '600px'
            break
        case 'impossible' :
            flags = 666
            s_squareSize = 15
            s_FontSize = 12
            t_delayTimeShowBomb = 15
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
        tempFlag = flags
        t_time = 0
        clearInterval(timeInterval)
        t_timePass.textContent = '000'
        cols = parseInt(c_width) 
        rows = parseInt(c_height) 
        canvas.width = cols
        canvas.height = rows
        OCcanvas.style.width = c_width
        d_playOnDifficult = difficult
        firstClick = true
        lose = false
        win = false
        field = new Array(rows / s_squareSize).fill().map(() => new Array(cols / s_squareSize).fill(0))
        TFfield = new Array(rows / s_squareSize).fill().map(() => new Array(cols / s_squareSize).fill(false))
        setTimeout(drawCanvas,10)
    }
    console.log(d_playOnDifficult)
}
//fill square function 
function fillHere(ctx, arr, color, size) {
    ctx.fillStyle = color;
    ctx.fillRect(arr[1] * size, arr[0] * size, size, size);
}
//fill text function
function drawText(ctx, arr, color, text) {
    ctx.font = `${s_FontSize}px Arial`
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, arr[1] * s_squareSize + s_squareSize / 2, arr[0] * s_squareSize + s_squareSize / 2)
}
//get flag on cell
function getFlagHere(ctx, arr, size){
    const flagImg = new Image()
    flagImg.src = i_flagSource
    ctx.globalAlpha = 1.0
    ctx.drawImage(flagImg, arr[1] * size, arr[0] * size, size, size)
}
//get bomb on cell
function getBombHere(arr, size){
    const bombImg = new Image()
    bombImg.src = i_bombSource
    ctx.globalAlpha = 1.0
    ctx.drawImage(bombImg,arr[1] * size, arr[0] * size, size, size)
}
//draw canvas 
function drawCanvas(){
    tempFlag = flags
    const cols = parseInt(c_width) 
    const rows = parseInt(c_height)
    canvas.width = cols
    canvas.height = rows
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < rows / s_squareSize; i++){
        for(let j = 0; j < cols / s_squareSize; j++){
            ctx.save()
            ctx.globalAlpha = 0.6
            fillHere(ctx, [i,j],((i + j) % 2 === 0) ? c_evenSquareColor : c_oddSquareColor,s_squareSize)
            if(TFfield[i][j] === 'Flag'){
                getFlagHere(ctx, [i,j],s_squareSize)
                tempFlag--
            }
            else if(TFfield[i][j]){
                ctx.globalAlpha = 0.5
                fillHere(ctx, [i,j],'bisque',s_squareSize)
                ctx.globalAlpha = 1.0
                if(field[i][j] > 0 && TFfield[i][j]){
                    const color = colorPalette[field[i][j] - 1]
                    drawText(ctx,[i,j],color,`${field[i][j]}`)
                }
            }
            ctx.restore()
        }
    }
    q_flagQuantity.textContent = `${tempFlag}`
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
let p_getMousePosition = [0,0]
canvas.addEventListener('mousemove', (event) => {
    if(lose || win) return
    p_MouseIsOnCanvas = true
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left 
    const mouseY = event.clientY - rect.top  
    const offset = -2.5 //for the mouse head
    const cell = [Math.floor((mouseY + offset)/ s_squareSize),Math.floor((mouseX + offset) / s_squareSize)]
    if(cell[0] != p_getMousePosition[0] || cell[1] != p_getMousePosition[1]){
        p_getMousePosition = cell
        drawCanvas()
        ctx.globalAlpha = 0.8
        fillHere(ctx, cell,'gray',s_squareSize)
        ctx.globalAlpha = 1.0
    }
});
//check if mouse is in the canvas or not
let p_MouseIsOnCanvas = false
canvas.addEventListener('mouseout', () => {
    p_MouseIsOnCanvas = false
})
//get new field for initial click
function getNewField(){
    cols = parseInt(c_width) / s_squareSize
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
    // console.log(field)
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
    timeInterval = setInterval(() => {
        t_time = Math.min(t_time + 1,999)
        t_timePass.textContent = `${'0'.repeat(3 - String(t_time).length)}${t_time}`
    }, 1000)
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
    if(lose || win) return
    if(firstClick){
        const i = p_getMousePosition[0]
        const j = p_getMousePosition[1]     
        f_firstPosClick = p_getMousePosition
        firstClick = false
        initialClick()
        revealCell(i,j)
        requestAnimationFrame(drawCanvas)
        // setTimeout(console.log(TFfield),10)
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
            //lose logic
            console.log('you lose')
            clearInterval(timeInterval)
            lose = true
            const getBombPos = []
            for(let a = 0; a < rows; a++){
                for(let b = 0; b < cols; b++){
                    if(field[a][b] === -1 && TFfield[a][b] != 'Flag')getBombPos.push([a,b])
                    if(TFfield[a][b] === 'Flag' && field[a][b] != -1){
                        ctx.globalAlpha = 0.6
                        fillHere(ctx,[a,b],'red',s_squareSize)
                        ctx.globalAlpha = 1.0
                    }
                }
            }
            alert(`you lose`)     
            console.log(`${getBombPos.length} bomb${getBombPos.length > 1 ? 's' : ''} left`)     
            let showBombInterval = setInterval(() => {
                if((!lose && !win) || getBombPos.length === 0){
                    clearInterval(showBombInterval)
                    return
                }
                const ranPos = Math.floor(Math.random() * getBombPos.length)
                const revealBombPos = getBombPos.splice(ranPos, 1)[0]
                getBombHere(revealBombPos, s_squareSize)
                console.log('get bomb')
            }, t_delayTimeShowBomb)
        }
        else {
            revealCell(i,j)
            requestAnimationFrame(drawCanvas)
            if(checkWin()){
                alert('you win')
                clearInterval(timeInterval)
            }
        }
    }
}
//handle put flag
function handlePutFlag(){
    const i = p_getMousePosition[0];
    const j = p_getMousePosition[1];
    if(!TFfield[i][j] && tempFlag > 0){
        TFfield[i][j] = 'Flag';
    } 
    else if(TFfield[i][j] === 'Flag') {
        TFfield[i][j] = false;
    }
    drawCanvas();
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
//remove tutorial after click
const tutorial = document.getElementById('tutorial')
const tutorStyle = document.querySelector('.removethis').style
tutorial.addEventListener('click', () => {
    tutorStyle.opacity = 0
    tutorStyle.zIndex = '-3'
})
const infomation = document.getElementById('info')
infomation.addEventListener('click', () => {
    tutorStyle.opacity = 1
    tutorStyle.zIndex = '4'
})
//function to check wwin
function checkWin(){
    cols = parseInt(c_width) / s_squareSize
    rows = parseInt(c_height) / s_squareSize
    let totalCells = rows * cols - flags
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(TFfield[i][j] === true){
                totalCells--
            }
        }
    }
    return totalCells === 0
}
//addition for keyboard button
document.addEventListener('keydown', (k) => {
    if((k.key != 'x' && k.key != 'z') || !p_MouseIsOnCanvas) return
    if(k.key === 'x'){
        if(lose || win) return
        if(firstClick){
            const i = p_getMousePosition[0]
            const j = p_getMousePosition[1]     
            f_firstPosClick = p_getMousePosition
            firstClick = false
            initialClick()
            revealCell(i,j)
            requestAnimationFrame(drawCanvas)
        }
        else if(p_MouseIsOnCanvas){
            f_firstPosClick = p_getMousePosition
            handleClickCell()
        }
    }
    else if(!firstClick && p_MouseIsOnCanvas){
        handlePutFlag()
    }
})
//restart button
document.getElementById('restart').addEventListener('click', () => {
    getNewCanvas(d_playOnDifficult)
    console.log('restart')
})