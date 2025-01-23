import { tasks as globalTask} from "./tasks.js"; let tasks = [...globalTask]
import { available as globalAvail} from "./tasks.js"; let available = [...globalAvail]
import { lockTask as globalLock} from "./tasks.js"; let lockTask = [...globalLock]
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

/* DANGER! For fix bugs only, please only modify it if you know what you are doing */
// const fixbug = 0
/* DANGER! For fix bugs only, please only modify it if you know what you are doing */
let showDifficult = 'all'
let showStatus = 'all'
let showInput = []
const renderTasks = () => {
    const taskList = document.getElementById('allTask');
    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {task.forEach( task => {
        // if(fixbug) {task.isDone = false
        // task.isLock = false
        // saveTasks()}
        if(showInput.length > 0) {
            if(!handleSearch(task)) return
        }
        if(showDifficult != 'all' && task.difficult != showDifficult) return
        if(showStatus != 'all' && task.isDone != showStatus) return 
        const taskDiv = document.createElement('div');
        taskDiv.style.height = '60px'
        taskDiv.style.width = 'auto'
        taskDiv.classList = `${task.isDone}Task`
        taskDiv.textContent = `${task.name} - difficulty: ${task.difficult}`
        taskDiv.addEventListener('click', () => {
            console.log(`task id:${task.index} , difficult: ${task.difficult}, status: ${task.isDone ? (task.isDone === true) ? 'completed' : 'inProgress' : 'uncomplete' },
                solution: ${task.solution}, star Rate: ${task.rate}`)
            getTaskCard(task)
        });
        taskList.appendChild(taskDiv);
    });})
};
/*initial action */
const maxTask = 4
loadTasks()
loadLockTask()
loadAvail()
renderTasks()
const renderLockTask = () => {
lockTask = []
tasks.forEach(taskss => {taskss.forEach(task => {task.isLock ? lockTask.push(task) : ''} )})
saveLockTask()
// console.log(lockTask)
}
renderLockTask()
/* */
const taskScreen = document.getElementById('taskScreen')
const cardContain = document.getElementById('cardContain')
function getTaskCard(arr) {
    let difficult,img, color,note, index
    switch(arr.difficult){
        case 'easy':
            difficult = 'easy'
            img = `../GetTask/image/copperStar.png`
            color = 'blue'
            note = 'seems like an easy one'
            index = 0
            break
        case 'medium':
            difficult = 'medium'
            img = `../GetTask/image/silverStar.png`
            color = 'silver'
            note = 'maybe hard to handle'
            index = 1
            break
        default:
            difficult = 'hard'
            img = `../GetTask/image/goldStar.png`
            color = 'gold'
            note = 'only pro coder dared to try this'
            index = 2
    } 
    // let getDifficult = (difficult === 'easy') ? 0 : (difficult === 'medium') ? 1 : 2
    let tagsLine = ''
    arr.tag.split('   ').forEach(tag => {
        tagsLine += `<span class="cardTag">${tag}</span>\n`
    })
    const newDiv = document.createElement('div')
    // <span class="cardTag">Tag</span>
    newDiv.innerHTML = `
    <div class="card">
        <div class="inCard" style="background-color: ${color}; height: 150px;">
            <img class="inCardimg" src=${img}>
        </div>
        <div class="inCard textFont title" >
            <strong>${arr.name}</strong>
        </div>
        <div class="textFont columns">
            ${tagsLine}
        </div>
        <div class="inCard textFont" style="font-size: 30px;">
            Difficult: ${difficult} <br>
            Coin: ${arr.coin} <br>
            ${note}
        </div>
        <div class="inCard" style="font-size: 30px;">
            Solution: <a ${(arr.isDone) ? `href="${arr.solution}" target="_blank"` : ''}>${(!arr.isDone) ? 'not yet' : (arr.isDone === true) ? 'go to solution' : 'in Progress'}</a>
        </div>
        <div class="inCard textFont" style="font-size: 30px;">
            Star Rate: ${arr.rate}
        </div>
        <div class="inCard textFont" >
            <button class="cardTag linkTask" style="width: auto; height: auto;min-width: 49%; ">
                Go To Problem
            </button>
            ${(arr.isDone === true) ? '' : 
            `<button class="cardTag taskLocker" style="width: 49%; height: auto; ">
                ${arr.isLock ? 'give up task' : 'do this task'}
            </button>`
            }
        </div>
    </div>
    `
    taskScreen.style.zIndex = 2
    taskScreen.style.opacity = '0.8'
    cardContain.style.zIndex = 3
    cardContain.append(newDiv)
    taskScreen.addEventListener('click', handleScreenClick)
    newDiv.querySelector('.linkTask').addEventListener('click', () => {window.open(arr.link, '_blank')})
    newDiv.querySelector('.taskLocker').addEventListener('click', () => {
        arr.isLock = !arr.isLock
        if(arr.isLock) {
            if(lockTask.length < maxTask) {
                alert('successfully get the task')
                arr.isDone = 'inProgress'
                lockTask.push(arr)
                tasks[index][arr.index].isLock = true
                tasks[index][arr.index].isDone = 'inProgress'
                saveLockTask()
                saveTasks()
                renderTasks()
            }
            else {
                alert(`cannot get more than ${maxTask} tasks at a time!`)
                arr.isLock = !arr.isLock
            }
        }
        else {
            alert('successfully remove task')
            lockTask.filter(task => {task.index != arr.index && task.difficult != arr.difficult})
            tasks[index][arr.index].isLock = false
            saveLockTask()
            saveTasks()
            renderTasks()
        }
        newDiv.querySelector('.taskLocker').textContent = `${arr.isLock ? 'give up task' : 'do this task'}`
        renderLockTask()
    })
}

function handleScreenClick() {
    taskScreen.removeEventListener('click', handleScreenClick)
    taskScreen.style.zIndex = -2
    taskScreen.style.opacity = '0'
    cardContain.innerHTML = ''
}

document.getElementById('progressFilter').addEventListener('change', () => {
    const value = document.getElementById('progressFilter').value
    switch(value) {
        case 'trueTasks': 
            showStatus = true
            break
        case 'falseTasks': 
            showStatus = false
            break
        case 'inProgressTasks': 
            showStatus = 'inProgress'
            break
        default:
            showStatus = 'all'
    }
    console.log(`filter status: ${showStatus}`)
    renderTasks()
})

document.getElementById('difficultFilter').addEventListener('change', () => {
    showDifficult = document.getElementById('difficultFilter').value
    console.log(`filter difficult: ${showDifficult}`)
    renderTasks()
})

document.getElementById('getSearch').addEventListener('click', getInput)

function getInput() {
    showInput = document.getElementById('searchInput').value.trim().toLowerCase().split(/\s+/)
    console.log(showInput)
    renderTasks()
}

function handleSearch(task) {
    const name = task.name;
    const tags = task.tag.split(/\s+/).map(tag => tag.toLowerCase());
    const nameMatches = name.startsWith(showInput.join(' '))
    const tagsMatch = showInput.every(tag => tags.some(t => t.startsWith(tag.toLowerCase())));
    return nameMatches || tagsMatch;
}

let instantSearch = false
document.getElementById('instantSearch').addEventListener('click', () => {
    instantSearch = !instantSearch
    if(instantSearch){
        document.getElementById('instantSearch').style.backgroundColor = 'mediumpurple' 
        document.getElementById('searchInput').addEventListener('input', getInput)
        document.getElementById('getSearch').removeEventListener('click', getInput)
        getInput()
        renderTasks()
    }
    else {
        document.getElementById('instantSearch').style.backgroundColor = 'white' 
        document.getElementById('searchInput').removeEventListener('input', getInput)
        document.getElementById('getSearch').addEventListener('click', getInput)
    }
})