import * as THREE from 'three'
import { helvetikerFont } from './fonts/helvetikerFont.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

class Block {
    constructor({
        width = 5,
        height = 5,
        depth = 5,
        cubeSize = 0.3,
        gapBetweenCubes = 0.01,
        color = 'white',
        blockCenter = [0,0,0],
        offsetX = (width + blockCenter[0] - 1) / 2,
        offsetY = (height + blockCenter[1] - 1) / 2,
        offsetZ = (depth + blockCenter[2] - 1) / 2
    } = {}) {
        this.group = new THREE.Group()
        this.width = width
        this.height = height
        this.depth = depth
        this.cubeSize = cubeSize
        this.gapBetweenCubes = gapBetweenCubes + cubeSize
        this.color = color
        this.blockCenter = blockCenter
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.offsetZ = offsetZ
        this.loader = new FontLoader()
        this.font3D = this.loader.parse(helvetikerFont)
        this.textMesh = {
            '3D': []
        }
        this.renderAxis = true
        this.blockGroup = new THREE.Group()
        this.axisGroup = new THREE.Group()
        this.getAxis(blockCenter)
        this.yLayer = {}
        this.layerFiltering = false
    }

    renderCubes(allowCubes) {
        if(allowCubes === undefined) return

        this.group.remove(this.blockGroup)
        this.blockGroup.clear()
        this.activeCubes = {amount: 0}
        this.yLayer = {}
        
        for(let [x,y,z, color] of allowCubes) {
            const cube = new Cube({size: this.cubeSize, color: color || 'white' , edge: true, info: [x,y,z, color]}).group
            cube.position.set(
                x * this.gapBetweenCubes,
                y * this.gapBetweenCubes,
                z * this.gapBetweenCubes
            )
            this.blockGroup.add(cube)
            this.activeCubes[`${x}_${y}_${z}`] = color
            this.activeCubes.amount++

            if(!this.yLayer[`${y}`]) this.yLayer[`${y}`] = []
            this.yLayer[`${y}`].push(cube)
        }

        this.group.add(this.blockGroup)
    }

    getAxis(startpos = [0,0,0]) {
        if(!Array.isArray(startpos) || startpos.length !== 3) startpos = [0,0,0]
        const directOffset = 0.5
        const origin = new THREE.Vector3(...startpos)
        const directX = new THREE.Vector3(this.offsetX * this.gapBetweenCubes + directOffset, 0, 0)
        const directY = new THREE.Vector3(0, this.offsetY * this.gapBetweenCubes + directOffset, 0)
        const directZ = new THREE.Vector3(0, 0, this.offsetZ * this.gapBetweenCubes + directOffset, 0)

        const xArrow = new THREE.ArrowHelper(
            directX, // direction
            new THREE.Vector3().subVectors(origin, directX),                     // starting point
            this.gapBetweenCubes * this.width + directOffset * 2,                          // length
            0xff0000,                   // color
            0.5,                        // arrowhead length
            0.1                        // arrowhead width
        )

        const yArrow = new THREE.ArrowHelper(
            directY,
            new THREE.Vector3().subVectors(origin, directY),
            this.gapBetweenCubes * this.height + directOffset * 2,
            0x00ff00,
            0.5,
            0.1
        )

        const zArrow = new THREE.ArrowHelper(
            directZ,
            new THREE.Vector3().subVectors(origin, directZ),
            this.gapBetweenCubes * this.depth + directOffset * 2,
            0x0000ff,
            0.5,
            0.1
        )

        const size = 0.6

        this.get3DText('X', 'red', [this.gapBetweenCubes * (this.width - this.offsetX) + 0.5,0.1,0], size)
        this.get3DText('Y', 'green', [0,this.gapBetweenCubes * (this.height - this.offsetY) + 0.5,0.1], size)
        this.get3DText('Z', 'blue', [0,0.1,this.gapBetweenCubes * (this.depth - this.offsetZ) + 0.5], size)

        for(let x = -this.offsetX; x < this.width - this.offsetX; x++) {
            if(x !== 0) {
                const text = `${x}`
                const arr = [x * this.gapBetweenCubes, 0.1, 0]
                this.get3DText(text, 'red', arr, size * 0.8)
            }
        }

        for(let y = -this.offsetY; y < this.height - this.offsetY; y++) {
            if(y !== 0) {
                const text = `${y}`
                const arr = [0, y * this.gapBetweenCubes, 0.1]
                this.get3DText(text, 'green', arr, size * 0.8)
            }
        }

        for(let z = -this.offsetZ; z < this.depth - this.offsetZ; z++) {
            if(z !== 0) {
                const text = `${z}`
                const arr = [0, 0.1, z * this.gapBetweenCubes]
                this.get3DText(text, 'blue', arr, size * 0.8)
            }
        }

        const center = new Cube({size: 0.05, color: 'white'}).group
        center.position.set(...this.blockCenter)

        this.axisGroup.add(xArrow, yArrow, zArrow, center)
        this.group.add(this.axisGroup)
    }

    get3DText(text = 'X', color = 'white', position = [0,0,0], scale = 1) {
        const geometry = new TextGeometry(text, {
            font: this.font3D,
            size: 0.2,             
            height: 0.05,          
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.01,  
            bevelSize: 0.01,
            bevelSegments: 3,
            curveSegments: 8      
        })
        geometry.center()
        const material = new THREE.MeshBasicMaterial({color: color})
        const mesh = new THREE.Mesh(geometry,material)
        mesh.position.set(...position)
        mesh.scale.set(scale, scale, scale)
        this.axisGroup.add(mesh)
        this.textMesh['3D'].push(mesh)
    }

    faceTo(type, target) {
        this.textMesh[type].forEach(mesh => {
            mesh.lookAt(target)
        })
    }

    toggleAxis(turnOn) {
        this.axisGroup.visible = turnOn
    }

    showLayer(layer = 0) {
        this.layerFiltering = layer !== 'all'
        Object.entries(this.yLayer).forEach(([key, arr]) => {
            const b = layer === 'all' || key == layer
            arr.forEach(cube => cube.visible = b)
        })
    }

    Object3D() {
        return this.group
    }
}

class Cube {
    constructor({size, color, edge = false, info = [0, 0, 0, 'white']} = {}) {
        this.size = size
        this.color = color
        this.edge = edge
        this.group = new THREE.Group()
        this.info = info
        this.createCube()
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        const material = new THREE.MeshStandardMaterial({ color: this.color })
        const cube = new THREE.Mesh(geometry, material)
        cube.userData.info = this.info
        this.group.add(cube)
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 'black', linewidth: 2 })
        const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
        this.group.add(edgeLines)
        return this.group
    }
}
export { Block }