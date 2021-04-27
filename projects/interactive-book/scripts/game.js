// const filePath = 'assets/story.json';
const url = 'https://lmazouin.github.io/projects/interactive-book/assets/story.json';

// fonction async qui permet de récupérer le contenu du l'histoire
const getStory = async () => {
  // const data = await fetch(filePath);
  const data = await fetch(url);
  return await data.json();
};

// appel de la fonction
getStory().then((story) => {
  console.log(story);
});

// function to inject the html code
const displayChapter = (title, content, choices) => {
  const container = document.querySelector('#chapter-container');
  // if there is already a chapter
  // remove it and replace it with a new chapter
  if (container.innerHTML) {
    container.innerHTML = '';
  }
  // insert the new chapter
  container.innerHTML = `<div class="card"></div>`;
  console.log(container.children[0]);
  container.children[0].innerHTML = `<h1 
                                      class="card-title text-center">
                                      ${title}
                                     </h1>
                                     <p class="card-text">${content}</p>`;
  // insert the choice buttons
  choices.forEach((choice) => {
    const {content, target} = choice;
    console.log(choice);
    container.children[0].innerHTML += `<button 
                                          class="btn btn-primary my-1"
                                          onclick="getChapter(${target})">
                                          ${content}
                                        </button>`;
  });
};


// render chapter on the page
const getChapter = (chapterId) => {
  getStory().then((story) => {
    story.forEach((chapter) => {
      if (chapter.id === chapterId) {
        const {title, content, choices} = chapter;
        displayChapter(title, content, choices);
      }
    });
  });
};

// show the first chapter
const startAdventure = () => {
  document.querySelector('#start-button').classList.add('hidden');
  getChapter(1);
};


/*
 Créer l'interface de l'application en HTML. Prenez en compte les éléments
 suivants :
 - Un gros bloc pour afficher le contenu du chapitre
 - Un espace au dessus du contenu pour afficher le titre
 - Plusieurs blocs pour afficher les choix possibles

  Si vous êtes chauds : Injecter le contenu du premier chapitre et les choix
  disponibles dans l'interface
 */
