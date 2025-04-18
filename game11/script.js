import { puzzles } from './puzzles.js'
import { nextLevel as getNextLevelFromPuzzle } from './puzzles.js'
import { Game } from './Game.js'
import { colorPalette } from './colorPalette.js'
//get info
const url = new URL(window.location.href)
const levelInfo = url.search.slice(1).split('&').map(info => info.split('=')[1])
if(levelInfo.length !== 2) {
    window.location.href = '?difficult=easy&puzzle=1'
}
console.log(levelInfo)
const infos = puzzles[levelInfo[0]][levelInfo[1]]

//get Game
const div1 = document.getElementById('block1')
const div2 = document.getElementById('block2')
const game = new Game({...infos, levelInfo: {difficult: levelInfo[0], level: levelInfo[1]}, parent1: div1, parent2: div2})

if(game.getSolution()) document.getElementById('solutionButton').disabled = false
//riel feature
const codeInput = document.getElementById('codehere')
const lineNumber = document.getElementById('lineNumber')
const shownText = document.getElementById('betterCodeText')
const timeBeforeRunCode = 500
let runCodeInterval
let runImmediate = true

codeInput.addEventListener('input', () => {
    updateInput(codeInput.value, runImmediate)
})

codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault()
        const start = codeInput.selectionStart
        const end = codeInput.selectionEnd
    
        codeInput.value = codeInput.value.substring(0, start) + '    ' + codeInput.value.substring(end)
        codeInput.selectionStart = codeInput.selectionEnd = start + 4

        updateInput(codeInput.value, runImmediate)
    }
})

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey) {
        if(e.key === 'ArrowRight') {
            e.preventDefault()
            updateInput(codeInput.value, true, 0)
        }

        if(e.key === '`') {
            e.preventDefault()
            getNextLevelFromPuzzle(...levelInfo)
        }
    }
})

codeInput.addEventListener('scroll', () => {
    lineNumber.scrollTop = codeInput.scrollTop
    shownText.scrollTop = codeInput.scrollTop
    shownText.scrollLeft = codeInput.scrollLeft
})

function updateLineNumber(input) {
    const length = input.split('\n').length
    lineNumber.innerHTML = [...new Array(length + 1).keys()].slice(1).join(`<br>`)
}

(function init() {
    const text = game.initialText.split('\n').map(s => s.trim()).filter(s => s).join('\n')
    codeInput.value = text
    requestAnimationFrame(() => {
        updateInput(text, true, 0)
    })
})()

function updateInput(input, isRun = true, timeout = timeBeforeRunCode) {
    showBetterCodeText(input || '//Show me how skibidi your code skill is...')
    updateLineNumber(input)
    clearTimeout(runCodeInterval)
    runCodeInterval = setTimeout(() => {
        if(isRun) game.tryRunCode(input)
    },timeout)
}

function showBetterCodeText(text) {
    //handle elements
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    //handle comments
    let commas = [false, false, false]
    text = text.split('\n').map(line => {
        const arr = line.split('')
        let prev = '#'
        for(let i = 0; i < arr.length; i++) {
            let c = arr[i]
            if(c === `'` && (prev !== `\\` || !commas[0])) commas[0] = !commas[0]
            else if(c === `"` && (prev !== `\\` || !commas[1])) commas[1] = !commas[1]
            else if(c === `\`` && (prev !== `\\` || !commas[2])) commas[2] = !commas[2]
            else if(i !== arr.length - 1 && c === '/' && arr[i + 1] === '/') {
                if(commas.every(b => !b)) {
                    return [...arr.slice(0, i),`<span style="opacity:0.5;">`,...arr.slice(i),`</span>`].join('')
                }
            }
            prev = (prev === `\\` && c === `\\`) ? '#' : c
        }
        return line
    }).join('\n')
    //handle x y z color
    text = text.replace(/\bx\b/g, '<span style="color: red;">x</span>')
    text = text.replace(/\by\b/g, '<span style="color: green;">y</span>')
    text = text.replace(/\bz\b/g, '<span style="color: blue;">z</span>')
    
    shownText.innerHTML = text
}
getSaveSetting()

//button interaction
document.getElementById('saveButton').addEventListener('click', () => {
    game.saveProgress()
})

document.getElementById('resetButton').addEventListener('click', () => {
    game.resetProgress()
})

document.getElementById('hintButton').addEventListener('click', () => {
    game.showHint()
})

document.getElementById('solutionButton').addEventListener('click', () => {
    const solution = game.getSolution()
    if(solution !== null) {
        const cf = confirm('show your previous solution?')
        if(cf) {
            codeInput.value = solution
            updateInput(solution, true, 0)
        }
    }
})
//main button interaction
document.getElementById('runButton').addEventListener('click', () => {
    updateInput(codeInput.value, true, 0)
})

document.getElementById('submitButton').addEventListener('click', () => {
    if(game.isComplete) {
        getNextLevelFromPuzzle(...levelInfo)
    }   
})

//color
const colorDiv = document.getElementById('colorPalette')
const colorHover = document.getElementById('colorName')
for(let [num, color] of Object.entries(colorPalette)) {
    const newDiv = document.createElement('div')
    newDiv.innerText = num 
    newDiv.style.backgroundColor = color
    newDiv.style.color = color === 'black' ? 'white' : 'black'
    newDiv.classList = 'no-select'
    newDiv.addEventListener('mouseover', () => {
        colorHover.innerHTML = `Color: <span style="color: ${color === 'black' ? 'white' : color};">${color}</span>`
    })
    colorDiv.append(newDiv)
}

colorDiv.addEventListener('mouseleave', () => {
    colorHover.innerHTML = `Color: `
})

//get saved setting
function getSaveSetting() {
    const func = {
        'chooseSyncRotate' : (b) => {
            game.toggleSync(b)
        },
        'chooseShowAxis' : (b) => {
            game.toggleAxis(b)
        },
        'chooseRunMethod' : (b) => {
            runImmediate = b
            updateInput(codeInput.value, b)
        },
        'chooseNotifyEqual': (b) => {
            game.popup = b
        },
        'chooseAutoSave': (b) => {
            game.ignoreSave = !b
        }
    }
    class Setting {
        constructor({id = '', bool = true} = {}) {
            this.id = id
            this.bool = bool
        }
        init() {
            this.div = document.getElementById(this.id)
            this.func = func[this.id]
            this.func(this.bool)
            this.div.checked = this.bool
            this.div.addEventListener('change', () => {
                this.bool = this.div.checked
                this.func(this.bool)
            })
        }
    }
    // localStorage.removeItem('userSetting')
    const text = localStorage.getItem('userSetting') || ''
    let settings = text ? JSON.parse(text).map(obj => new Setting(obj)) : []
    if(settings.length < Object.keys(func).length) {
        settings = [
            ...Object.keys(func).map(key => new Setting({id: key}))
        ]
    }
    //init
    settings.forEach(setting => setting.init())
    //save before page load
    window.addEventListener('beforeunload', () => localStorage.setItem('userSetting', JSON.stringify(settings)))
}