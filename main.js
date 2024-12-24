'use strict'

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const searchInput = document.getElementById('search-input');

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
    {
        id: 4,
        name: "Water sort",
        description: "test xem ban co bi mu mau khong...",
        creator: "Kiene",
        thumbnail: "./game4/thumbnail.png",
        link: "./game4/"
    },
    {
        id: 5,
        name: "Ran san moi",
        description: "tre con thoi nay dau biet nokia la gi",
        creator: "Kiene",
        thumbnail: "./game5/image.png",
        link: "./game5/"
    },
    {
        id: 6,
        name: "battle ship",
        description: "ban tau tum lum",
        creator: "Kiene",
        thumbnail: "./game6/image.png",
        link: "./game6/"
    },
]

const placeholdThumbnail = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/1022px-Placeholder_view_vector.svg.png?20220519031949"

const gallery = $('#gallery');

let query = '';

renderGameGallery();
function renderGameGallery() {
    gallery.innerHTML = gameData.map(game => {
        return `
            <div class="card" style="width: 18rem; min-height: 286px; ${checkDisplay(query, game) ? '' : 'display: none;'}">
                <img src="${game.thumbnail ? game.thumbnail : placeholdThumbnail}" 
                    class="card-img-top" 
                    alt="game_image"
                    style="height: 200px; object-fit: cover;">
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


// Search feature

function checkDisplay(query, gameInfo) {
    if (!query) return true; 
    return gameInfo.name.toLowerCase().includes(query.toLowerCase()) ||
        gameInfo.description.toLowerCase().includes(query.toLowerCase());
}

// Event listener for search input
searchInput.addEventListener('input', () => {
    query = searchInput.value;
    renderGameGallery(); 
});


