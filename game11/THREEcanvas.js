import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

class THREEcanvas {
    constructor({
        parent = null,
        children = [],
        width = window.innerWidth / 2,
        height = window.innerHeight / 2,
        FOV = 40,
        near = 0.1,
        far = 1000,
        background = 'pink',
        lightIntensity = 0.6,
        directLightIntensity = 0.8,
        directLightPosition = [5,5,5],
        rotatable = true,
        damping = false,
        syncBlock = null
    } = {}) {
        this.parent = parent
        this.children = children
        this.canvas = document.createElement('canvas')
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(FOV, width / height, near, far)
        this.scene.background = new THREE.Color(background)
        this.backgroundColor = background
        this.width = width
        this.height = height
        this.lightIntensity = lightIntensity
        this.directLightIntensity = directLightIntensity
        this.directLightPosition = [...directLightPosition]
        this.rotatable = rotatable
        this.damping = damping
        this.syncBlock = syncBlock
        this.isSync = false
        this.initialDistance = 250 / FOV
        this.update = false
        this.raycaster = new THREE.Raycaster()
        this.mousePos = new THREE.Vector2()
        this.pointingCube = null
        this.init()
    }

    init() {
        // this.camera.position.z = this.initialDistance
        this.camera.position.set(3.5, 3.5, 3.5)
        this.canvas.style.width = `${this.width}px`
        this.canvas.style.height = `${this.height}px`
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: false,
            premultipliedAlpha: true
        })
        this.renderer.setSize(this.width, this.height)
        if(this.lightIntensity) {
            const light = new THREE.AmbientLight('white', this.lightIntensity)
            this.scene.add(light)
        }
        if(this.directLightIntensity) {
            const directional = new THREE.DirectionalLight('white', this.directLightIntensity)
            directional.position.set(...this.directLightPosition)
            this.scene.add(directional)
        }
        if(this.rotatable) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.enableDamping = this.damping
        }
        {
            this.maskDiv = document.createElement('div')
            this.maskDiv.style.width = `${this.width}px`
            this.maskDiv.style.height = `${this.height}px`
            this.maskDiv.classList = 'maskDiv no-select'
        }
        if(this.parent !== null) {
            this.appendTo(this.parent)
            this.parent.append(this.maskDiv)
        }
        for(let child of this.children) {
            this.setChild(child)
        }
        if(this.syncBlock !== null) {
            this.setSyncBlock(this.syncBlock)
        }
        window.addEventListener('resize', () => {
            this.renderer.setSize(this.width, this.height)
            this.camera.aspect = this.width / this.height
            this.camera.updateProjectionMatrix()
        })
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mousePos.set(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            )

            this.raycaster.setFromCamera(this.mousePos, this.camera)
            const cubes = this.children[0].blockGroup.children.map(group => group.children[0])
            const intersect = this.raycaster.intersectObjects(cubes)[0] || null
            if(intersect) {
                if(this.pointingCube !== null) {
                    this.pointingCube.material.emissive.setHex(0x000000)
                }
                this.pointingCube = intersect.object
                this.pointingCube.material.emissive.setHex(0x444444)
                const info = this.pointingCube.userData.info
                this.displayPointCubePos(...info)
            }
            else if(this.pointingCube !== null) {
                this.pointingCube.material.emissive.setHex(0x000000)
                this.pointingCube = null
                this.displayPointCubePos('x', 'y', 'z', this.backgroundColor)
            }
        })
        this.displayPointCubePos('x', 'y', 'z', this.backgroundColor)
    }

    displayPointCubePos(x,y,z, color) {
        const html = 
        [`Position: <span style="color: red;">${x}</span> <span style="color: green;">${y}</span> <span style="color: blue;">${z}</span>`,
        `Color: <span style="color: ${color};">${color}</span>`].join('<br>')
        this.maskDiv.innerHTML = html
    }
    
    syncRotation = () => {
        if(this.syncBlock !== null) {
            this.camera.position.copy(this.syncBlock.camera.position)
            this.camera.quaternion.copy(this.syncBlock.camera.quaternion)
        }
        if(this.isSync) requestAnimationFrame(this.syncRotation)
    }
    /**
     * 
     * @param {THREEcanvas} block 
     * @description: a helper function which makes this block sync camera position with another block
     */
    setSyncBlock(block) {
        this.syncBlock = block
        this.isSync = true
        this.syncBlock.canvas.addEventListener('mousedown', this.startSyncBlock)
        this.syncBlock.canvas.addEventListener('mouseup', this.cancelSyncBlock)
    }

    startSyncBlock = () => {
        this.isSync = true
        this.syncRotation()
    }

    cancelSyncBlock = () => {
        this.isSync = false
    }

    changeSyncBlock(block = null) {
        this.isSync = false
        if(block === null) {
            this.syncBlock.canvas.removeEventListener('mousedown', this.startSyncBlock)
            this.syncBlock.canvas.removeEventListener('mouseup', this.cancelSyncBlock)
            this.syncBlock = null
        }
        else {
            this.setSyncBlock(block)
        }
    }

    appendTo(parent) {
        parent.appendChild(this.renderer.domElement)
        parent.append(this.canvas)
    }

    setChild(child) {
        this.scene.add(child.Object3D())
        child.parent = this
    }

    startAnimate() {
        this.update = true
        this.animate()
    }

    endAnimate() {
        this.update = false
    }

    animate() {
        if(!this.update) return
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
        this.controls.update()
    }

    loopFuncUntilTrue = (func = new Function('return true')) => {
        const check = func()
        if(!check) requestAnimationFrame(() => this.loopFuncUntilTrue(func))
    }
}

export { THREEcanvas }