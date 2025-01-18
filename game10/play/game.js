/*game level */
import {games as skibidi} from "./levels.js"
let games = skibidi
function getLevel() {
    const levels = localStorage.getItem('games')
    if(levels) games = JSON.parse(levels)
}
function saveLevel() {
    localStorage.setItem('games', JSON.stringify(games))
}

getLevel()

/*get div into game */
let index = 1
const levels = document.getElementById('levels')
games.forEach(game => {
    if(game.message) return
    const redirect = document.createElement('a')
    if(!game.isLock) redirect.href = `./level/?${index}`
    redirect.classList = 'linkLvl'
    const newDiv = document.createElement('div')
    newDiv.classList = `hoverZoom lv${index} inLevel`
    const src = '../image/lock.png'
    const alt = 'lock level'
    const description =(game.isLock) ? 'play previous levels to unlock this' : `level ${index}`
    newDiv.innerHTML = 
    `
    ${(game.isLock) ? `<img src="${src}" alt="${alt}">` : `${index}`}
    <div class="description">${description}</div>
    `
    index++
    // console.log(redirect.href)
    redirect.append(newDiv)
    levels.append(redirect)
})