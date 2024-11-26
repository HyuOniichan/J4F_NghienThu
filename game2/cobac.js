const imagesContainer = document.getElementById('gameImage');
const debugMessage = document.getElementById('debugMessage');
const resultMessage = document.getElementById('resultMessage');

imagesContainer.style.display = 'block'; // Show the images container
const imagesArr = Array.from(imagesContainer.getElementsByTagName('img')).map(img => ({ src: img.src }));
let dice = [1, 2, 3, 4, 5, 6];
let result = 0;

// Function to handle button click
function handleButtonClick(event) {
    const buttonId = event.target.id; // Get the ID of the clicked button
    debugMessage.textContent = `Ban chon: ${buttonId}`; // Debug
    switch (buttonId) {
        case 'Tai':
            return 1;
        case 'Xiu':
            return 2;
        case 'Chan':
            return 3;
        case 'Le':
            return 4;
    }
}

// Function to spawn random image
function RandImg() {
    const randomIndex = Math.floor(Math.random() * dice.length);
    const randomDiceValue = dice[randomIndex];
    const selectedImage = imagesArr[randomDiceValue - 1];
    const newImg = document.createElement('img');
    newImg.src = selectedImage.src;
    newImg.alt = `Dice roll: ${randomDiceValue}`;
    newImg.style.opacity = '1';
    imagesContainer.appendChild(newImg);

    // Fade out effect
    setTimeout(() => {
        newImg.style.opacity = '0';
    }, 500);

    result += randomDiceValue; // Accumulate the actual dice value
}

// Attach event listeners to buttons (assuming buttons have IDs 'Tai', 'Xiu', 'Chan', 'Le')
document.getElementById('Tai').addEventListener('click', handleButtonClick);
document.getElementById('Xiu').addEventListener('click', handleButtonClick);
document.getElementById('Chan').addEventListener('click', handleButtonClick);
document.getElementById('Le').addEventListener('click', handleButtonClick);

// Example usage of result calculation after clicking
let getResult = 0; // Initialize getResult

function startGame() {
    getResult = handleButtonClick(event); // Get the result based on the button clicked
    result = 0; // Reset result for the new game

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            RandImg();
        }, i * 1000); // Delay for each image spawn
    }

    // Final result check after all images have been shown
    setTimeout(() => {
        let checkResult = false;
        switch (getResult) {
            case 1:
                checkResult = result > 10; break;
            case 2:
                checkResult = result < 11; break;
            case 3:
                checkResult = result % 2 === 0; break;
            case 4:
                checkResult = result % 2 === 1; break;
        }
        const finalResult = checkResult ? "Ban da thang!" : "Ban thua roi..";
        resultMessage.textContent = `Ket qua: ${result}, ${finalResult}`;
    }, 6000); // Wait for all images to be shown before checking result
}