/* cat behavior */
//declare information
const z_initialTopOfTheCat = window.innerHeight / 2.5
const z_floorConstSpeed = 2
let isDie = false
let isJumping = false
const gravi = 1.96
//initial action
const cat = document.getElementById('cat')
function upAndDown(){
    let currentTop = z_initialTopOfTheCat;
    cat.style.top = `${currentTop - 25}px`
    setTimeout(() => {
        cat.style.top = `${currentTop + 25}px`
    },500)
    console.log('moving')
}
upAndDown()
const z_initialAction = setInterval(upAndDown,1000)

//fly the cat
function catDown(){
    if(!isJumping){
        cat.style.transition = ''
        cat.style.animationDuration = '0s'
        cat.style.animation = ''
        cat.style.top = `${parseInt(cat.style.top) + gravi}px`
        console.log('moving down')
    }
}
let z_gravityInterval = setInterval(catDown,10)
/* move floor */
const floor1 = document.getElementById('f1')
const floor2 = document.getElementById('f2')
floor1.style.left = '0'
floor2.style.left = `${floor2.offsetWidth}px`
function moveFloor(floor){
    const getLeft = parseInt(floor.style.left)
    floor.style.left = (getLeft < -floor.offsetWidth) ? `${getLeft + floor.offsetWidth * 2}px` : `${getLeft - z_floorConstSpeed}px`
}
function runFloor(){
    moveFloor(floor1)
    moveFloor(floor2)
    if(isDie) clearInterval(z_getFloorRun)
}
const z_getFloorRun = setInterval(runFloor,10)
/* handling 'pipe' */
//limit: top: -350px to -650px ; bottom = top + 950px; place from right = -100px
const pipe1 = document.getElementById('p1')
const pipe2 = document.getElementById('p2')
function placePipes(){
    const pos = (Math.random() * 301 + 350) * -1
    const upPipe = new Image()
    const downPipe = new Image()
    upPipe.src = pipe1.src
    downPipe.src = pipe2.src
    upPipe.style.top = `${pos + 950}px`
    downPipe.style.top = `${pos}px`
    moving(upPipe)
    moving(downPipe)
}

function moving(pipe){
    pipe.classList.add('pipe')
    pipe.style.right = '-100px'
    document.body.appendChild(pipe)
    checkDie(pipe,cat)
    const pipeInterval = setInterval(() => {
        const right = parseInt(pipe.style.right)
        if(checkDie(pipe,cat) || isDie){
            clearInterval(pipeInterval)
            clearInterval(getPipes)
        }
        if(right > window.innerWidth + 100){
            pipe.remove()
            clearInterval(pipeInterval)
            console.log('delete pipe')
        }
        else{
            pipe.style.right = `${right + z_floorConstSpeed}px`
        }
    },10)
}

let getPipes = setInterval(placePipes,2000)
function stopPipe(){
    clearInterval(getPipes)
}
function runPipe(){
    getPipes = setInterval(placePipes,2000)
}
stopPipe()
/*handle die case */
function checkDie(pipe,cat){
    const hitbox = -50
    const rect1 = pipe.getBoundingClientRect()
    const rect2 = cat.getBoundingClientRect()
    if ((rect1.x + rect1.width + hitbox > rect2.x && rect1.x < rect2.x + rect2.width + hitbox && rect1.y + rect1.height + hitbox > rect2.y && rect1.y < rect2.y + rect2.height + hitbox) || parseInt(cat.style.top) >= window.innerHeight - cat.offsetHeight) {
        console.log('die')
        isDie = true
        return true
    }
    return false
}

/* start game = click on screen */
let z_isStartGame = false
document.addEventListener('click', handleGame)
function handleGame(){
    if(!z_isStartGame){
        isDie = false
        runPipe()
        z_isStartGame = true
        cat.style.transition = ''
        clearInterval(z_initialAction)
    }
    else{
        catFly()
    }
}