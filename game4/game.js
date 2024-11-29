// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
/* Create initial water levels situation. */

function createRandomArray() {
const pool = [];
for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 4; j++) {
        pool.push(i);
    }
}

for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]; // Swap elements
}

const result = [];
for (let i = 0; i < 4; i++) {
    const newArray = [...pool.slice(i * 10, (i + 1) * 10), 0, 0];
    result.push(newArray);
}

const colorPalette = {
    0: "#f0f0f0",
    1: "#c94c4c",
    2: "#feb236",
    3: "#a2c11c",
    4: "#4040a1",
    5: "#f7cac9",
    6: "#ffef96",
    7: "#7c73e6",
    8: "#f9d5e5",
    9: "#588c7e",
    10: "#80ced6",
};

const coloredResult = result.map(array => {
    return array.map(number => colorPalette[number]);
});

return coloredResult;
}

/* Get the history of the situation to make undo button */

let history = [createRandomArray()]
console.log(history)
document.getElementById('undoButton').disabled = true;

function addHistory(newArr) {
    history.push(newArr);
    document.getElementById('undoButton').disabled = false; // Enable the undo button
}

// Undo button functionality
function modifyHistory() {
    if (history.length > 1) {
        currentArray = history.pop(); // Revert to the last state
        createBottles();
        // Disable the undo button if there's no history left
        if (history.length === 1) {
            document.getElementById('undoButton').disabled = true;
        }
    }
}
/* clear all div */
function clearDiv() {
    const childDivs = document.getElementsByClassName("childDiv");
    for (let i = 0; i < childDivs.length; i++) {
      childDivs[i].innerHTML = ""; 
    }
}

/*draw 12 bottles */


function createBottles() {
    clearDiv();
    let current = history[history.length - 1];
    for(let col = 0; col < 12; col++){
        let getClass = `.Bottle${col}`
        for(let row = 0; row < 4; row++){
            let color = current[row][col]
            const newDiv = document.createElement('div')
            newDiv.className = `rectangle waterLevel C${col}`
            newDiv.style.backgroundColor = color;
            document.querySelector(getClass).appendChild(newDiv)
        }
    }
}

createBottles();

/*get click on bottles */
let firstBottle = null;
let secondBottle = null;

function clicked(event) {
    // Get the clicked element
    const clickedElement = event.target;
  
    // Extract the number from the class name
    const numberClass = clickedElement.classList[2]; // Get the second class name
    const IndexB = parseInt(numberClass.substring('C'.length));
  
    console.log(`bottle ${IndexB}`);
  
    if (firstBottle === null) {
      firstBottle = IndexB;
    } else if (secondBottle === null) {
      secondBottle = IndexB;
      console.log('handle click...');
      handleClicks(firstBottle, secondBottle);
      firstBottle = null;
      secondBottle = null;
    }
  }
  
  // Add event listener to each bottle
  for (let i = 0; i <= 11; i++) {
    const bottleElement = document.querySelector(`.C${i}`);
    if (bottleElement) { // Check if the element exists
      bottleElement.addEventListener("click", clicked);
    } else {
      console.warn(`Bottle element with class .Bottle${i} not found.`);
    }
  }

function handleClicks(firstBottle,secondBottle){
    let current = history[history.length - 1];
    if(current[0][secondBottle] != '#f0f0f0' || current[3][firstBottle] == '#f0f0f0') return;
    let availSpace = 0;
    let waterLength = 0;
    let color = '';
    let startPoint = 0;
    //calculate the available space at bottle 2
    for(let i = 0; i < 4; i++){
        if(current[i][secondBottle] != '#f0f0f0') break;
        availSpace++;
    }
    //calculate the amount of waters levels has same color at bottle 1
    for(let i = 0; i < 4; i++){
        if(current[i][firstBottle] != '#f0f0f0'){
            color = current[i][firstBottle]
            startPoint = i
            while(i < 4 && color == current[i][firstBottle]){
                waterLength++
                i++
            }
            break;
        }
    }
    while(availSpace != 0 && waterLength != 0){
        current[availSpace - 1][secondBottle] = color
        current[startPoint][firstBottle] = '#f0f0f0'
        startPoint++
        waterLength--
        availSpace--
    }
    addHistory(current);
    createBottles();
}

/* game button control*/
function startGame() {
    history = [createRandomArray()];
    console.log(history);
    document.getElementById("undoButton").disabled = true;
    createBottles();
}

document.getElementById('newGame').addEventListener('click' , startGame)
