import { tasks as globalTask} from "../tasks.js"; let tasks = [...globalTask]
import { available as globalAvail} from "../tasks.js"; let available = [...globalAvail]
import { lockTask as globalLock} from "../tasks.js"; let lockTask = [...globalLock]
// const taskContainer = document.getElementById('taskContainer')
//load tasks
const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
};
const loadLockTask = () => {
    const savedLockTasks = localStorage.getItem('lockTask');
    if (savedLockTasks) {
        lockTask = JSON.parse(savedLockTasks);
    }
};
const loadAvail = () => {
    const savedAvail = localStorage.getItem('available');
    if (savedAvail) {
        lockTask = JSON.parse(savedAvail);
    }
};
//save tasks
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
const saveLockTask = () => {
    localStorage.setItem('lockTask', JSON.stringify(lockTask));
};
const saveAvail = () => {
    localStorage.setItem('available', JSON.stringify(available));
};
loadTasks()
loadAvail()
loadLockTask()

const imageDiv = document.querySelectorAll('.starDiv')
const background = document.getElementById('taskBackground')
const description = document.getElementById('description')
const gachaVid = document.getElementById('gachaVid')
const scrtask = document.getElementById('taskScreen')
const cardContain = document.getElementById('cardContain')
let eventListen = true
let getTasks = []
if(lockTask.length > 0){
    eventListen = false
    lockTask.forEach(task => {
        getTasks.push(task)
    })
    handleShowTasks(lockTask.length)
}
else{
    let difficulty = 'easy'
    let avail = available[0].available
    let offset = 0
    imageDiv.forEach(image => {
        image.addEventListener('click', () => {
            imageDiv.forEach(image => {
                image.classList.remove('zoom')
            })
            image.classList.add('zoom')
            offset = image.id[2] - '0' 
            background.style.transform = `translateX(${0 - 450 * offset}px)`
            avail = available[offset].available
            switch(offset){
                case 0:
                    difficulty = 'easy'
                    break
                case 1:
                    difficulty = 'medium'
                    break
                case 2:
                    difficulty = 'hard'
                    break
                default:
                    difficulty = 'all'
            }
            description.innerText = `
            difficult : ${difficulty} 
            total task : ${difficulty === 'all' ? 900 : 300}
            available task : ${avail}
            `
        })
    })
    let times = 0
    document.querySelectorAll('.rollButton').forEach(button => {
        button.addEventListener('click', () => {
            console.log('play video')
            console.log(`current difficult roll: ${difficulty}`)
            times = button.id[1] - '0'
            getTasks = []
            for(let i = 0; i < times; i++){
                let rand = Math.floor(Math.random() * avail) + 1
                console.log(rand)
                let tempTask
                let chosenTasks
                let position = 0
                if(offset === 3){
                    const index = Math.floor(rand / 300)
                    rand %= 300
                    chosenTasks = tasks[index]
                }
                else chosenTasks = tasks[offset]
                while(rand){
                    if(!chosenTasks[position].isDone){
                        rand--
                        tempTask = chosenTasks[position]
                        position++
                    }
                }
                getTasks.push(tempTask)
            }
            console.log('get task:')
            console.log(getTasks)
            const navbar = document.querySelector('.navbar')
            navbar.style.display = 'none'
            gachaVid.style.visibility = 'visible'
            gachaVid.style.zIndex = '2'
            gachaVid.currentTime = 0
            gachaVid.play()
        })
    })
    gachaVid.addEventListener('ended', () => {
        gachaVid.style.visibility = 'hidden'
        gachaVid.style.zIndex = '-2'
        handleShowTasks(times)
    })
}
function validInput(input, target) {
    console.log(input)
    let temp = input.slice(30,undefined).split('/')
    console.log(temp)
    const regex = /^\d+$/
    return (
        temp[0] === target && 
        temp[1] === 'submissions' && 
        regex.test(temp[2])
    );
}

function handleShowTasks(times) {
    scrtask.style.zIndex = '2'
    scrtask.style.opacity = '0.8'
    scrtask.style.backgroundColor = 'black'
    for(let i = 0; i < times; i++){
        const arr = getTasks[i]
        let difficult,img, color,note
        let getIndex = arr.index
        switch(arr.difficult){
            case 'easy':
                difficult = 'easy'
                img = `./image/copperStar.png`
                color = 'blue'
                note = 'seems like an easy one'
                break
            case 'medium':
                difficult = 'medium'
                img = `./image/silverStar.png`
                color = 'silver'
                note = 'maybe hard to handle'
                break
            default:
                difficult = 'hard'
                img = `./image/goldStar.png`
                color = 'gold'
                note = 'only pro coder dared to try this'
        } 
        let getDifficult = (difficult === 'easy') ? 0 : (difficult === 'medium') ? 1 : 2
        let tagsLine = ''
        let maxAmount = 3;
        arr.tag.split('   ').forEach(tag => {
            if((maxAmount && tag.length <= 10) || maxAmount === 3) {
                tagsLine += `<span class="cardTag">${tag}</span>\n`
                maxAmount--
            }
        })
        setTimeout(() => {
            const newDiv = document.createElement('div')
            // <span class="cardTag">Tag</span>
            newDiv.innerHTML = `
            <div class="card">
                <div class="inCard" style="background-color: ${color}; height: 100px;">
                    <img class="inCardimg" src=${img}>
                </div>
                <div class="inCard textFont title" >
                    <strong>${arr.name}</strong>
                </div>
                <div class="inCard textFont columns">
                    ${tagsLine}
                </div>
                <div class="inCard textFont">
                    Difficult: ${difficult} <br>
                    Coin: ${arr.coin} <br>
                    ${note}
                </div>
                <div class="inCard" >
                    <input placeholder="Solution" class="userInput" disabled>
                    <button class="confirmInput" style="color: red; background-color: green;" disabled> upload </button>
                </div>
                <div class="inCard textFont" >
                    <input class="rateInput" placeholder="Rate from 1 to 5" disabled>
                    <button class="rateButton" disabled>Rate!</button>
                </div>
                <div class="inCard textFont" >
                    <button class="cardTag linkTask" style="width: 100px; height: auto; ">
                        Go To Problem
                    </button>
                </div>
            </div>
            `
        newDiv.querySelector('.linkTask').addEventListener('click', () => {
            window.open(arr.link, '_blank')
        })
        const confirmInput = newDiv.querySelector('.confirmInput')
        const input = newDiv.querySelector('.userInput');
        input.addEventListener('input', () => {
            if (validInput(input.value.trim(), arr.link.slice(30,undefined))) {
                confirmInput.textContent = "Upload"
                confirmInput.disabled = false
            } else {
                confirmInput.textContent = "Invalid"
                confirmInput.disabled = true
            }
        })
        const rateButton = newDiv.querySelector('.rateButton')
        const inputRate = newDiv.querySelector('.rateInput')
        inputRate.addEventListener('input', () => {
            const input = Math.floor(inputRate.value.trim())
            if (input >= 1 && input <= 5) {
                rateButton.textContent = "Rate!"
                rateButton.disabled = false
            } else {
                rateButton.textContent = "X"
                rateButton.disabled = true
            }
        })
        confirmInput.addEventListener('click', () => {
            confirmInput.remove()
            input.disabled = true
            rateButton.disabled = false
            inputRate.disabled = false
            saveTasks()
        })
        rateButton.addEventListener('click', () => {
            rateButton.remove()
            tasks[getDifficult][getIndex].isDone = true
            tasks[getDifficult][getIndex].solution = input.value.trim()
            tasks[getDifficult][getIndex].rate = Math.floor(inputRate.value.trim())
            tasks[getDifficult][getIndex].isLock = false
            saveTasks()
            lockTask.splice(i, 1)
            saveLockTask()
            if(lockTask.length === 0) location.reload();
        })
        if(!eventListen){
            input.disabled = false
        }
        cardContain.append(newDiv)
        },i * 500)
        if(eventListen) setTimeout(() => {
            document.getElementById('accepted').disabled = false
            document.getElementById('declined').disabled = false
        },1500)
    }
    document.getElementById('accepted').addEventListener('click', () => {
        getTasks.forEach(arr => {
            let getDifficult = (arr.difficult === 'easy') ? 0 : (arr.difficult === 'medium') ? 1 : 2
            let getIndex = arr.index
            tasks[getDifficult][getIndex].isLock = true
            tasks[getDifficult][getIndex].isDone = 'inProgress'
            arr.isLock = true
            arr.isDone = 'inProgress'
        })
        lockTask = [...getTasks]
        saveLockTask()
        saveTasks()
        cardContain.querySelectorAll('.userInput').forEach(input => {
            input.disabled = false
        })
        console.log(lockTask)
        document.getElementById('declined').disabled = true
    })
    document.getElementById('declined').addEventListener('click', () => {
        cardContain.innerHTML = ''
        scrtask.style.zIndex = '-2'
        scrtask.style.opacity = '0'
        scrtask.style.backgroundColor = 'white'
        document.getElementById('accepted').disabled = true
        document.getElementById('declined').disabled = true
        getTasks = []
    })
}