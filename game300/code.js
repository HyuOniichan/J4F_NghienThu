import { tasks as globalTask} from "./tasks.js";
import { lockTask as taskLock } from "./tasks.js";
let tasks = [...globalTask]
let fixbug = 0
if(fixbug) localStorage.setItem('lockTask', '[]')
//load tasks
const loadTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
};
//save tasks
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
//render task
const renderTasks = () => {
    const taskList = document.getElementById('allTask');
    taskList.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {task.forEach( task => {
        if(fixbug) {task.isDone = false
        task.isLock = false
        saveTasks()}
        const taskDiv = document.createElement('div');
        taskDiv.style.height = '50px'
        taskDiv.style.width = 'auto'
        taskDiv.classList = `${task.isDone}Task`
        taskDiv.textContent = `Task ${task.index + 1} difficult ${task.difficult}`
        taskDiv.addEventListener('click', () => {
            console.log(`task id:${task.index} , difficult: ${task.difficult}, status: ${task.isDone ? (task.isDone === true) ? 'completed' : 'inProgress' : 'uncomplete' },
                solution: ${task.solution}, star Rate: ${task.rate}`)
        });
        taskList.appendChild(taskDiv);
    });})
};

loadTasks()
renderTasks()