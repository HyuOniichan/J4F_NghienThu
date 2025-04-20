//default initialSolution
const initialSolution = new Function('x','y','z', 'return 4')
//default block info
const blockInfo = {
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
            `,
            hint: `try getting remainer while dividing coordinate`
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