import { Block } from './Block.js'
import { THREEcanvas } from './THREEcanvas.js'
import { colorPalette } from './colorPalette.js'
class Game {
    constructor({
        levelInfo = {
            difficult: 'easy',
            level: 1
        },
        blockInfo = {
            width : 5,
            height : 5,
            depth : 5,
            cubeSize : 0.3,
            gapBetweenCubes : 0.01,
            color : 'white',
            blockCenter : [0,0,0],
            offsetX : undefined,
            offsetY : undefined,
            offsetZ : undefined
        },
        canvasInfo = {
            parent : null,
            children : [],
            width : window.innerWidth / 2,
            height : window.innerHeight / 2,
            FOV : 40,
            near : 0.1,
            far : 1000,
            background : 'pink',
            lightIntensity : 0.6,
            directLightIntensity : 0.8,
            directLightPosition : [5,5,5],
            rotatable : true,
            damping : false,
            syncBlock : null
        },
        parent1 = document.body,
        parent2 = document.body,
        initialSolution = new Function('x','y','z', 'return 4'),
        initialText = ' ',
        hint = 'no hint :D'
    } = {}) {
        //initial variables
        this.levelInfo = levelInfo
        this.blockInfo = blockInfo
        this.block1 = new Block(blockInfo)
        this.block2 = new Block(blockInfo)
        this.canvas1 = new THREEcanvas({...canvasInfo, parent: parent1, children: [this.block1]})
        this.canvas2 = new THREEcanvas({...canvasInfo, parent: parent2, children: [this.block2]})
        this.initialSolution = initialSolution
        this.initialText = initialText
        this.hint = hint
        this.colorPalette = colorPalette
        this.name = levelInfo.difficult + '_' + levelInfo.level
        this.popup = false
        this.ignoreSave = false
        this.isComplete = false
        this.submitButton = document.getElementById('submitButton')
        //functions
        this.Start()
        this.syncInitialShape()
        this.isMouseDown = false
        this.canvas1.controls.addEventListener('change', this.faceUser)
    }

    Start() {
        this.canvas1.setSyncBlock(this.canvas2)
        this.canvas2.setSyncBlock(this.canvas1)
        this.canvas1.startAnimate()
        this.canvas2.startAnimate()
        //try get save from localStorage
        const save = localStorage.getItem(this.name) || false
        if(save) {
            this.initialText = save
            console.log('load previous save')
        }
        window.addEventListener('beforeunload', (event) => {
            if(!this.ignoreSave) this.saveProgress()
        })
    }

    syncInitialShape() {
        let arr = []
        for(let x = 0; x < this.blockInfo.width; x++) {
            for(let y = 0; y < this.blockInfo.height; y++) {
                for(let z = 0; z < this.blockInfo.depth; z++) {
                    const res = this.initialSolution(x - this.block2.offsetX, y - this.block2.offsetY, z - this.block2.offsetZ)
                    if(this.colorPalette[res]) {
                        arr.push([x,y,z, this.colorPalette[res]])
                    }
                }
            }
        }
        this.block1.renderCubes([])
        this.block2.renderCubes(arr)
    }

    tryRunCode(input) {
        try {
            const func = new Function('x', 'y', 'z', input)
            let arr = []
            for(let x = 0; x < this.block1.width; x++) {
                for(let y = 0; y < this.block1.height; y++) {
                    for(let z = 0; z < this.block1.depth; z++) {
                        const res = func(x - this.block1.offsetX, y - this.block1.offsetY, z - this.block1.offsetZ)
                        if(this.colorPalette[res]) {
                            arr.push([x,y,z, this.colorPalette[res]])
                        }
                    }
                }
            }
            this.block1.renderCubes(arr)
            requestAnimationFrame(this.faceUser)
        } catch(err) {
            this.block1.renderCubes([])
        }
        requestAnimationFrame(() => {
            this.isComplete = this.checkEqual()
            if(this.isComplete) {
                this.setSolution(input)
                if(this.popup) {
                    requestAnimationFrame(() => { 
                        alert('Congratulation!')
                    })
                }
            }
            this.submitButton.style.backgroundColor = this.isComplete ? 'green' : 'red'
        })
    }

    checkEqual() {
        return this.block1.activeCubes.amount === this.block2.activeCubes.amount 
        && Object.keys(this.block1.activeCubes).every(key => this.block1.activeCubes[key] === this.block2.activeCubes[key])
    }

    getSolution() {
        const itemName = 'solution->' + this.levelInfo.difficult + '_' + this.levelInfo.level
        return localStorage.getItem(`${itemName}`) || null
    }

    setSolution(solution = '') {
        try {
            document.getElementById('solutionButton').disabled = false
        } catch(err) {}
        const itemName = 'solution->' + this.levelInfo.difficult + '_' + this.levelInfo.level
        if(solution) localStorage.setItem(`${itemName}`, solution)
        else localStorage.removeItem(`${itemName}`)
    }

    faceUser = () => {
        this.block1.faceTo('3D', this.canvas1.camera.position)
        this.block2.faceTo('3D', this.canvas2.camera.position)
    }

    toggleSync(turnOn) {
        this.canvas1.changeSyncBlock(turnOn ? this.canvas2 : null)
        this.canvas2.changeSyncBlock(turnOn ? this.canvas1 : null)
    }

    toggleAxis(b) {
        this.block1.toggleAxis(b)
        this.block2.toggleAxis(b)
    }

    saveProgress() {
        const text = document.getElementById('codehere').value
        localStorage.setItem(this.name, text)
    }

    resetProgress() {
        const cf = confirm('reset code?')
        if(!cf) return
        localStorage.removeItem(this.name)
        if(this.getSolution()) {
            const deleteSolution = confirm('reset solution too?')
            if(deleteSolution) {
                this.setSolution('')
            }
        }
        this.ignoreSave = true
        window.location.reload()
    }

    showHint() {
        alert(this.hint)
    }
}

export { Game }