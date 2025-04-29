import {d} from './functions.js'
import {tasks} from './game300/tasks.js'
let userData = {
    name: '',
    email: '',
    password: '',
    level: 1,
    experience: 0,
    coins: 100,
    history: []
}
let initialUpdate = {
    isInitial: true
}
initialUpdate = d.loadData('initialUpdate')
userData = d.loadData('userData')
function updateCoinsGame300() {
    const tasks = d.loadData('tasks')
    if(!tasks) return
    tasks.flat().forEach(task => {
        if(task.isDone) userData.coins += task.coin
    })
    d.saveData(userData, 'userData')
}
if(initialUpdate.isInitial) {
    updateCoinsGame300()
    initialUpdate.isInitial = false
    d.saveData(initialUpdate, 'initialUpdate')
}
console.log(userData)