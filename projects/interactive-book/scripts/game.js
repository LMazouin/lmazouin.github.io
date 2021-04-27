// fonction async qui permet de récupérer le contenu du l'histoire
const getStory = async () => {
  const data = await fetch('assets/story.json');
  return await data.json();
};


// appel de la fonction
getStory().then(function(story) {
  console.log(story);
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
