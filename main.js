'use strict'

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const gameData = [
    {
        id: 1, 
        name: "Catch the Falling Objects", 
        description: "Made by ChatGPT", 
        creator: "ChatGPT", 
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyKZN1v55ezQJX_ueiP6YzgAELLGQHpH14kg&s", 
        link: "./game1/"
    }, 
    {
        id: 2, 
        name: "Vua co bac", 
        description: "Tai xiu chan le?", 
        creator: "Kiene",
        thumbnail: "./game2/images/dice1dot.gif", 
        link: "./game2/"
    }, 
    {
        id: 3, 
        name: "Dodge the Obstacles", 
        description: "Ne vat the", 
        creator: "Kiene",
        thumbnail: "", 
        link: "./game3/"
    }, 
]

const placeholdThumbnail = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1022px-Placeholder_view_vector.svg.png?20220519031949"

const gallery = $('#gallery');

renderGameGallery(); 
function renderGameGallery() {
    gallery.innerHTML = gameData.map(game => {
        return `
            <div class="card" style="width: 18rem;">
                <img src=${game.thumbnail? game.thumbnail : placeholdThumbnail} class="card-img-top" alt="game_image">
                <div class="card-body">
                    <h5 class="card-title">${game.name}</h5>
                    <p class="card-text">${game.description}</p>
                    <a href="${game.link}" class="btn btn-primary d-flex justify-content-center">
                        Play
                    </a>
                </div>
            </div>
        `
    }).join('');
} 


