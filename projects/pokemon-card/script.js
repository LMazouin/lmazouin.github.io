// global variables

const form = document.querySelector('form');
const main = document.querySelector('main');


const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
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
  return data.name;
};

// returns an array with all the types of a Pokémon
const getTypesOfPokemon = (data) => {
  const types = [];
  data.types.forEach((element) => {
    types.push(element.type.name);
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
  img.classList.add('w-75', 'mx-auto', 'my-1');
  img.classList.add('card-img', 'border', 'border-dark', 'rounded');
  card.appendChild(img);
};

// creates the title of a Pokémon card
const createCardTitle = (card, pokemonName) => {
  const h5 = document.createElement('h5');
  h5.classList.add('card-header');
  const text = document.createTextNode(pokemonName);
  h5.append(text);
  card.appendChild(h5);
};

// creates the body of a Pokémon card
const createCardBody = (card, types) => {
  const main = document.createElement('main');
  main.classList.add('card-body');
  const p = document.createElement('p');
  types.forEach((type) => {
    const typeColor = typeColors[type];
    const span = document.createElement('span');
    const text = document.createTextNode(type);
    span.classList.add('rounded-pill', 'p-2', 'me-1');
    span.style.backgroundColor = typeColor;
    span.append(text);
    p.appendChild(span);
  });
  main.appendChild(p);
  card.appendChild(main);
};


const createCard = (pokemonName, info, imageUrl) => {
  const existingCard = document.querySelector('main article');
  if (existingCard !== null) {
    existingCard.remove();
  }
  const card = document.createElement('article');
  card.classList.add('card', 'w-50', 'border-dark');
  createCardTitle(card, pokemonName);
  createCardImage(card, imageUrl, pokemonName);
  createCardBody(card, info);
  main.appendChild(card);
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchInput = document.getElementById('input');
  const searchedPokemon = searchInput.value.toLowerCase();
  console.log(searchedPokemon);
  const url = `https://pokeapi.co/api/v2/pokemon/${searchedPokemon}`;
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = response.json();
      data = await jsonResponse;
      console.log(data);
    } else {
      throw Error('invalid Pokémon name');
    }
  } catch (error) {
    console.log('Error:', error);
  }
  pokemonName = getNameOfPokemon(data);
  types = getTypesOfPokemon(data);
  imageUrl = getImageUrlOfPokemon(data);
  createCard(pokemonName, types, imageUrl);
});
