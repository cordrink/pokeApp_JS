const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');
const types = {
    grass: '#78c850',
    ground: '#E2BF65',
    dragon: '#6F35FC',
    fire: '#F58271',
    electric: '#F7D02C',
    fairy: '#D685AD',
    poison: '#966DA3',
    bug: '#B3F594',
    water: '#6390F0',
    normal: '#D9D5D8',
    psychic: '#F95587',
    flying: '#A98FF3',
    fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};


let allPokemon = [];
let tableauFin = [];


function fetchPokemonBase() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        .then(reponse => reponse.json())
        .then(allPoke => {
            // console.log(allPoke);
            allPoke.results.forEach(pokemon => {
                fetchPokemonComplet(pokemon)
            })
        } )
}

fetchPokemonBase();

function fetchPokemonComplet(pokemon) {
    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name

    fetch(url)
        .then(reponse => reponse.json())
        .then(pokedata => {
            // console.log(pokedata);

            objPokemonFull.pic = pokedata.sprites.front_default;
            objPokemonFull.type = pokedata.types[0].type.name;
            objPokemonFull.id = pokedata.id;

            fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
                .then(reponse => reponse.json())
                .then(pokedatas => {
                    // console.log(pokedatas);

                    objPokemonFull.name = pokedatas.names[4].name;
                    allPokemon.push(objPokemonFull);

                    if (allPokemon.length === 151) {
                        // console.log(allPokemon);

                        tableauFin = allPokemon.sort((a, b) => {
                            return a.id - b.id;
                        }).slice(0, 21);

                        // console.log(tableauFin)
                        createCard(tableauFin);

                        chargement.style.display = 'none';
                    }
                })
        })

}

// Creation des cartes

function createCard(arr) {
    for (let i = 0; i < arr.length; i++) {
        const carte = document.createElement('li');
        let couleur = types[arr[i].type];
        carte.style.background = couleur;
        const txtCarte = document.createElement('h5');
        txtCarte.innerText = arr[i].name;
        const idCarte = document.createElement('p');
        idCarte.innerText = `ID ${arr[i].id}`;
        const imgCarte = document.createElement('img');
        imgCarte.src = arr[i].pic;

        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
    }
}

// scroll infini

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // scrollTop = scroll depuis le top
    // scrollHeight = scrol total
    // clientHeight = hauteur de la fenetre, partie visible.

    if (clientHeight + scrollTop >= scrollHeight - 10) {
        addPoke(6);
    }
});

let index = 21;

function addPoke(nb) {
    if (index > 150) {
        return;
    }

    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);

    index += nb;
}

// Recherche

searchInput.addEventListener('keyup', recherche);

function recherche() {
    if (index < 151) {
        addPoke(130)
    }

    let filter, allLi, titleValue, allTitles;

    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles = document.querySelectorAll('li > h5');

    for (let i = 0; i < allLi.length; i++) {
        titleValue = allTitles[i].innerText;

        if (titleValue.toUpperCase().includes(filter) ) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }

}

// Animation

searchInput.addEventListener('input', (e) => {
    if (e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    } else {
        e.target.parentNode.classList.remove('active-input');

    }
});