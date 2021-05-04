// global variables

let data;

const url = 'https://pokeapi.co/api/v2/pokemon/ditto';
const fetchButton = document.querySelector('button');
const main = document.querySelector('main');

const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electrik: '#F8D030',
  ice: '#98D8D8',
  fight: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
};

// get data from the API
const getData = async () => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = response.json();
      return jsonResponse;
    }
    throw Error('API server not responding');
  } catch (error) {
    console.alert('Error:', error);
  }
};

// returns the pokemonName of a Pokémon
const getNameOfPokemon = (data) => {
  return data.pokemonName;
};

// returns an array with all the types of a Pokémon
const getTypesOfPokemon = (data) => {
  const types = [];
  data.types.forEach((type) => {
    types.push(type.pokemonName);
  });
  return types;
};

// returns the url of a picture of the Pokémon
const getImageUrlOfPokemon = (data) => {
  return imageUrl = data.sprites.other['official-artwork'].front_default;
};

const createCardImage = (card, imageUrl, pokemonName) => {
  const img = document.createElement('img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('alt', `picture of ${pokemonName}`);
  img.classList.add('card-img');
  card.appendChild(img);
};

// creates the title of a Pokémon card
const createCardTitle = (card, pokemonName) => {
  const h5 = document.createElement('h5');
  h5.classList.add('card-header');
  const text = document.createTextNode(pokemonName);
  h5.append(text);
  card.appendChild(title);
};

// creates the body of a Pokémon card
const createCardBody = (card, types) => {
  const main = document.createElement('main');
  main.classList.add('card-body');
  const p = document.createElement('p');
  types.forEach((type) => {
    const span = document.createElement('span');
    const text = document.createTextNode(type);
    span.append(text);
    p.appendChild(span);
  });
  main.appendChild(p);
  card.appendChild(main);
};


const createCard = (pokemonName, info, imageUrl) => {
  const card = document.createElement('article');
  card.className = 'card';
  createCardTitle(card, pokemonName);
  createCardImage(card, imageUrl, pokemonName);
  createCardBody(card, info);
  main.appendChild(card);
};

getData().then((data) => {
  console.log(data);
  pokemonName = getNameOfPokemon(data);
  types = getTypesOfPokemon(data);
  imageUrl = getImageUrlOfPokemon(data);
  createCard(pokemonName, type, imageUrl);
});

const fetchPokemon = () => {
  console.log('hello');
};


// prevents the page from reloading upon submitting a form
// event.preventDefault()
