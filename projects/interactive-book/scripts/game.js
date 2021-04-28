// json stuff
// const filePath = 'assets/story.json';
const url = 'https://lmazouin.github.io/projects/interactive-book/assets/story.json';

const getStory = async () => {
  // const data = await fetch(filePath);
  const data = await fetch(url);
  return await data.json();
};

// global DOM elements
const sectionChapter = document.getElementById('chapter');
const sectionChoices = document.getElementById('choices');

const createChoiceButton = (section, choice, story) => {
  const {content, target} = choice;
  const button = document.createElement('button');
  button.innerText = content;
  button.className = 'btn btn-primary';
  button.addEventListener('click', () => {
    updatePage(target, story);
  });
  section.appendChild(button);
};

const getChapterById = (story, chapterId) => {
  return story.find((chapter) => chapter.id === chapterId);
};


const createChapter = (section, chapter) => {
  const chapterTitle = document.createElement('h1');
  const chapterContent = document.createElement('p');
  const {title, content} = chapter;
  chapterTitle.innerText = title;
  chapterContent.innerText = content;
  section.appendChild(chapterTitle);
  section.appendChild(chapterContent);
};


// render chapter on the page
const updatePage = (chapterId, story) => {
  sectionChapter.innerHTML = '';
  sectionChoices.innerHTML = '';
  const chapter = getChapterById(story, chapterId);
  createChapter(sectionChapter, chapter);
  const {choices} = chapter;
  choices.forEach((choice) => {
    createChoiceButton(sectionChoices, choice, story);
  });
};

getStory().then((story) => {
  console.log(story);
  pdatePage(1, story);
});


/*
 Créer l'interface de l'application en HTML. Prenez en compte les éléments
 suivants :
 - Un gros bloc pour afficher le contenu du chapitre
 - Un espace au dessus du contenu pour afficher le titre
 - Plusieurs blocs pour afficher les choix possibles

  Si vous êtes chauds : Injecter le contenu du premier chapitre et les choix
  disponibles dans l'interface
 */
