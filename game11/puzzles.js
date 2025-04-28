//default initialSolution
const initialSolution = new Function('x','y','z', 'return 4')
//default block info
const blockInfo = {
    sizes : [],
    width : 5,
    height : 5,
    depth : 5,
    cubeSize : 0.3,
    gapBetweenCubes : 0.01,
    color : 'white',
    blockCenter : [0,0,0]
}
//default canvas info
const canvasInfo = {
    parent : null,
    children : [],
    width : window.innerWidth / 2,
    height : window.innerHeight / 2,
    FOV : 40,
    near : 0.1,
    far : 1000,
    background : 'paleVioletRed',
    lightIntensity : 0.6,
    directLightIntensity : 0.8,
    directLightPosition : [5,5,5],
    rotatable : true,
    damping : false,
    syncBlock : null
}

//all puzzles
export const puzzles = {
    easy: {
        1: {
            //all equal default
            initialText : `
            //Hello Bro!
            //Your goal is to make the upper cube the same as the lower cube
            //by writing a function that return color (in number) for each 
            //small cube , or return a number that is not in the color palette
            //to disable that small cube.
            //In this puzzle we will try to change color for all the cubes:
            //with no condition , all cubes should be enable

            return 9
            `,
            hint : `see the color palette at the bottom left`
        },
        2: {
            initialSolution: (x,y,z) => {
                return y % 2 ? 6 : 8
            },
            initialText :`
            //now we will learn how to change a cube base on its coordinate
            //as you see: x, y, and z variables has their color different
            //those variables are the position of the small cubes 
            //which base on the position of the coordinate origin
            //you can change them , but the code's behavior can goes wrong
            //the coordinate outside the allow area will not render!
            if(x === y || x === -y) return 4
            else return 7
            `,
            hint : `try return the color by y layer`
        },
        3: {
            initialSolution: (x,y,z) => {
                if(y === -1) return 2
                else if(y === 1 && Math.abs(x) === 1) return 2
                else return 7
            },
            initialText : `
            //if you don't exactly know the position of a block or it's color,
            //try pointing at it with mouse
            //the block position and color will appear on the left up corner
            //and also remember that you're coding in javaScript
            //so the other variable can be declare!
            let dx = Math.abs(x)
            if(dx === 2 && y === 0 && z === 0) return 5
            `,
            hint : `point at cubes to get their positions and do the code logic`
        },
        4: {
            initialSolution : (x,y,z) => {
                if((!x || !y || !z )) return 20
            },
            initialText :`
            // Tips: The color palette is scrollable!
            // The value you return could be larger that the
            // amount of available colors, and it will return the color 
            // equal to the remainer of it divide by amount
            // But if the return value is smaller than 0 or 
            // is divisible by amount, it will disable the cube
            if(y > 0) return 69
            return -1
            `
        },
        5: {
            initialSolution : (x,y,z) => {
                if(!(x || z) && Math.abs(y) < 2) return 14
                else if(!y && Math.abs(x) < 2 && Math.abs(z) < 2) return 1
                return 15
            },
            initialText : `
            //that seems equal... But they're not!
            //try using the option 'show specific y layer' 
            //at the right up corner, and check for each layer!
            return 15
            `,
            hint :`turn on show y axis option and change to see what happened!`
        },
        6: {
            blockInfo : {
                ...blockInfo,
                depth: 11,
                offsetZ: 0
            },
            initialSolution : (x,y,z) => {
                if(Math.abs(y) < 2 && Math.abs(x) < 2) {
                    if(x || y) {
                        return 27
                    }
                    else return 28
                }
            },
            initialText : `
            //hotdog!
            //Note that the shape not always 5 * 5 * 5
            //Also the coordinate origin not always at the center of the block
            if(z % 2 === 0 && y * y < 4 && x * x !== 0) return 10
            `,
            hint : `hint: use brain`
        },
        7: {
            initialSolution : (x,y,z) => {
                return x + y + z + 7
            },
            initialText : `
            //Rainbow? 
            //remember: x, y, z values depend on the coordinate
            return 16 - x
            `,
            hint : `Try get sum of the coordinates`
        },
        8: {
            initialSolution : (x,y,z) => {
                if(!y) return Math.abs(x + z) + 1
            },
            initialText : `
            //colored floor
            return 15
            `
        },
        9: {
            initialSolution : (x,y,z) => {
                if(x === y && y === z) return 14
            },
            initialText : `
            //a rod?
            if(x === 1) return x * y * z
            `,
            hint: `hint???`
        },
        10: {
            blockInfo : {
                ...blockInfo,
                width: 9,
                height: 9,
                depth: 9
            },
            initialSolution : (x,y,z) => {
                let limit = Math.abs(y)
                if(Math.abs(x) <= limit && Math.abs(z) <= limit) {
                    return 32 - limit
                }
                else if(Math.abs(x) === 4 && Math.abs(z) === 4) return 28
            },
            initialText : `
            //hourglass
            //Last lesson: you can declare the given value to a value without errors
            //but it will not affect the actual position
            //it just turn that value into a declared value
            x = 3 //no error
            y = 4 //no error
            return x + y - z //will return depends on z
            `,
            hint : `try do each shape part seperately`
        }
    },
    medium: {
        1: {
            initialSolution : (x,y,z) => {
                return x % y ? 3 : y % z ? 6 : z % x ? 9 : 0
            },
            initialText : `
            //#?
            return x * x 
            `,
            hint: `try getting remainer while dividing coordinate`
        },
        2 : {
            initialSolution : (x,y,z) => {
                if(x == 0 && y == 0 && z == 0) return 6
                if(Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1 ) return 0
                if((!x || !y || !z )) {
                    if(x && y) return 7
                    if(y && z) return 18
                    if(x && z) return 30
                    return 19
                }
            },
            initialText : `
            //minecraft conduit setup
            return 17
            `,
            hint : `try get conditions base on x,y,z coordinate`
        },
        3 : {
            blockInfo : {
                ...blockInfo,
                sizes: [9, 9, 9]
            },
            initialSolution : (x,y,z) => {
                x = Math.abs(x)
                y = Math.abs(y)
                z = Math.abs(z)
                let a = 2
                if((x == y + a && y == z + a) || (z == x + a && y == z + a) || (x == y + a && z == x + a)) return 3
                if(x == y && y == z) return 3
            },
            initialText : `
            //cobweb?
            if(x == y) return z + 5
            `
        },
        4 : {
            blockInfo : {
                ...blockInfo,
                sizes : [5, 13, 5]
            },
            initialSolution : (x,y,z) => {
                //stick
                if(y <= 3 && x == 0 && z == 0) {
                    return 1
                }
                //lollipop
                if(y >= 2) {
                    let ax = Math.abs(x)
                    let ay = Math.abs(y - 4)
                    let az = Math.abs(z)
                    let c = 9
                    if(ax + ay + az >= 6) return 0
                    if(ax >= ay && ax >= az) return (ax + c)
                    if(ay >= ax && ay >= az) return (ay + c)
                    if(az >= ax && az >= ay) return (az + c)
                }
                return 0
            },
            initialText : `
            //lollipop
            const lollipop = {
                sweet: 6969,
                flavor: 'raspberry',
                score: '10/10'
            }
            return lollipop.sweet
            `,
            hint : `taste that lollipop :P`
        },
        5 : {
            blockInfo : {
                ...blockInfo,
                sizes: [7,7,17]
            },
            initialSolution : (x,y,z) => {
                if(Math.abs(x) == 3) {
                    //bridge columns
                    if(Math.abs(z) == 4) return y == 3 ? 3 : 4
                    if(Math.abs(z) == 8 && y < 0) return y === -1 ? 1 : 4
                    if(z == 0 && y == -1) return 3
                    //strings
                    if(y >= 0 && Math.abs(4 - Math.abs(z)) + y == 3) {
                        return 1
                    }
                }
                if(y == -2) {
                    //line
                    if(Math.abs(z) % 4 !== 2 && x == 0) {
                        return 14
                    }
                    //road
                    return 15
                }
            },
            initialText : `
            //bridge
            return y ? 0 : 32
            `,
            hint: `just build a bridge`
        },
        6 : {
            blockInfo : {
                ...blockInfo,
                sizes: [19,11,1]
            },
            initialSolution : (x,y,z) => {
                const arr = [
                    [1,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,1],
                    [1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
                    [1,1,1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1],
                    [1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
                    [1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
                    [],
                    [1,0,1,0,1,1,1,0,1,1,0,0,1,0,0,0,1,1,0],
                    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1],
                    [1,0,1,0,1,0,1,0,1,1,0,0,1,0,0,0,1,0,1],
                    [1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1],
                    [1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0]
                ]
                return arr[5 - y][x + 9] * (y > 0 ? 1 : 3)
            },
            initialText : `
            //Hello World!
            if(x == 2 && y == 1 && z == 0) return 3
            `,
            hint : `render for each position of hello world letters (fr fr)`
        },
        7 : {
            blockInfo : {
                ...blockInfo,
                sizes: [9,9,9]
            },
            initialSolution : (x,y,z) => {
                x = Math.abs(x)
                z = Math.abs(z)
                let r = 5
                if(y <= 1 && x + y + z <= r) return 3
                return 6
            },
            initialText : `
            //small beach cube!
            return y < 0 ? 24 : 17
            `,
            hint : `don't forget the 'show specific y layer' option`
        },
        8 : {   
            blockInfo : {
                ...blockInfo,
                sizes: [15, 9, 3]
            },
            initialSolution : (x,y,z) => {
                if(x + y <= -2) {
                    //center of the speaker: -4,-1,z
                    x += 4
                    y += 1
                    //inside
                    if(Math.abs(x) <= 1 && Math.abs(y) <= 1) return ((x + y) % 2) ? 23 : 31
                    //outside
                    if((Math.abs(x) <= 2 && Math.abs(y) < 2) || (Math.abs(x) < 2 && Math.abs(y) <= 2)) return 20
                    x -= 4
                    y -= 1
                }
                //???
                if(y == 3) return  14
                if(x >= 0 && x < 7) {
                    //idk lines (decoration?)
                    if(y == 1) {
                        return 14 + Math.abs(Math.abs(x - 3) - 3)
                    }
                    if(y <= -1 && y >= -3) {
                        if(x == 0 || x == 6) return 14
                        //buttons
                        if(y == -2) return x % 2 ? 28 : 30
                        //background
                        return 14
                    }
                }
                //base color
                return 21
            },
            initialText : `
            //radio ???
            return 21
            `
        },
        9 : {
            blockInfo: {
                ...blockInfo,
                sizes : [7,7,7]
            },
            initialSolution : (x,y,z) => {
                const abs = (a) => Math.abs(a) 
                if(abs(y) < 3 && abs(x) < 2) {
                    if(y >= 0) {
                        if(z <= -3 && x == 0) {
                            return  0
                        }
                        if(z < 0) {
                            if(x != 0 || (y == 2)) return
                        }
                        else {
                            if((x + y) % 2) return
                            return 7
                        }
                    }
                    else {
                        if( z - y >= 1) return
                        if(x != 0) return
                    }
                    //base color
                    return 10
                }
            },
            initialText : `
            //gun?
            x = Math.abs(x)
            y = Math.abs(y)
            if(x <= 1 && y <= 2) return 3
            `,
            hint : `try using condition for each layer`
        },
        10 : {
            blockInfo : {
                ...blockInfo,
                sizes : [9,5,9]
            },
            initialSolution: (x,y,z) => {
                //day (trang)
                let ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z)
                if(ax == 2 && (az == 4 || ay == 2)) {
                    return 15
                }
                if(az == 2 && (ax == 4 || ay == 2)) {
                    return 15
                }
                //nhan banh
                if(ax <= 3 && ay <= 1 && az <= 3) {
                    //thit ba chi (hong + ca hoi)
                    if(ax <= 2 && y == 0 && az <= 2) {
                        return x % 2 ? 22 : 32
                    }
                    //do (vang)
                    return 3
                }
                //mau la chuoi
                return 4
            },
            initialText : `
            //Banh Chung (chung cake)
            return 14
            `,
            hint : `banh chung rat ngon`
        }
    },
    hard: {
        1 : {
            blockInfo: {
                ...blockInfo,
                sizes: [11,13,11]
            },
            initialSolution : (x,y,z) => {
                const ax = Math.abs(x)
                const ay = Math.abs(y)
                const az = Math.abs(z)
                //be co
                if(y < -3 && ax < ay && az < ay) {
                    return ay
                }
                //cot co
                if(x == 0 && z ==0) return y == 6 ? 14 : 15
                if(z == 0 && y > 0 && x > 0) {
                    //ngoi sao
                    {
                        let dx = x - 2
                        let dy = y - 2
                        if(dx >= 0 && dy >= 0 && dx <= 2 && dy <= 2 && [
                            [1,0,1],
                            [0,1,0],
                            [1,1,1]
                        ][dy][dx]) return 3
                    }
                    //la co
                    if(y < 6) return 1
                }
            },
            initialText : `
            //flag
            return 1
            `
        },
        2 : {
            blockInfo: {
                ...blockInfo,
                sizes: [9,9,9]
            },
            initialSolution: (x,y,z) => {
                if(x * x + y * y + z * z < 24) return 22
            },
            initialText: `
            //sphere
            return 4 * 4 * 4 * 3 / 4
            `
        },
        end : {
            blockInfo: {
                ...blockInfo,
                sizes: [43,7,1]
            },
            initialSolution: (x,y,z) => {
                if(y === -3) return 19
                y--
                const text = [
                    [1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0],
                    [0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0],
                    [0,0,1,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0],
                    [0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0,0],
                    [0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,1,0,1,0,1],
                    []
                ]
                const colorIndex = (Math.floor(Math.abs((x + 21)) / 3) + 1)
                return text[2 - y][x + 21] * colorIndex
            },
            initialText : `
            //the end :(
            return Math.floor(Math.random() * 32) + 1
            `,
            hint : `bye`
        }
    }
}

export function nextLevel(currentLevelDifficult, currentLevelIndex) {
    const keys = Object.keys(puzzles[currentLevelDifficult])
    const index = keys.indexOf(currentLevelIndex)
    let info = []
    if(index + 1 === keys.length) {
        const difficultKeys = Object.keys(puzzles).map(String)
        const difficultIndex = difficultKeys.indexOf(currentLevelDifficult)
        if(difficultIndex + 1 === difficultKeys.length) {
            alert('this is the last level...')
        }
        else info = [difficultKeys[difficultIndex + 1], '1']
    }
    else info = [currentLevelDifficult, keys[index + 1]]
    if(info.length) {
        window.location.href = `?difficult=${info[0]}&puzzle=${info[1]}`
    }
}

//developer mode
window.developerMode = false