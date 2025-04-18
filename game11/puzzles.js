//default initialCondition
const initialCondition = new Function('x','y','z', 'return 1')
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
    background : 'pink',
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
            //which base on the position of the BLOCK CENTER
            //you can change them , but the code's behavior can goes wrong

            if(x === y || x === -y) return 4
            else return 7
            `,
            hint : `try return the color by y layer`
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