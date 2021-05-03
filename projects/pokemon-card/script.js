// global variables

const url = 'https://pokeapi.co/api/v2/pokemon/ditto';
const fetchButton = document.querySelector('button');
const main = document.querySelector('main');

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


const createCardImage = (card, imageUrl, name) => {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = name;
  img.className = 'card-img';
  img.style.width = '200px';
  card.appendChild(img);
};

const createCardTitle = (card, text) => {
  const title = document.createElement('h5');
  title.innerText = text;
  title.className = 'card-header';
  title.style['text-transform'] = 'uppercase';
  card.appendChild(title);
};

const createCardBody = (card, info) => {
  const body = document.createElement('div');
  body.className = 'card-body';
  const text = document.createElement('p');
  text.innerText = info;
  text.classList.add('card-text');
  body.appendChild(text);
  card.appendChild(body);
};

const createCard = (name, info, imageUrl) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.style.width = '200px';
  createCardTitle(card, name);
  createCardImage(card, imageUrl, name);
  createCardBody(card, info);
  main.appendChild(card);
};

getData().then((data) => {
  console.log(data);
  const {name, types, sprites} = data;
  let info = 'Type: ';
  types.forEach((element) => {
    const {type} = element;
    info += `${type.name}\t`;
  });
  const imageUrl = sprites.other['official-artwork'].front_default;
  createCard(name, info, imageUrl);
});

