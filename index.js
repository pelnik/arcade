const gameContentElement = document.querySelector('#game-content');

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;


// Box ids start from one
if (window.screen.width > largeScreenCutoff) {
  for (let i = 0; i < numberOfColsForLargeScreen * numberOfRowsForLargeScreen; i++) {
    const newElement = document.createElement('div');
    newElement.className = 'box';
    newElement.id = `box-${i + 1}`;
    gameContentElement.appendChild(newElement);
  }
}

function getBoxNumber(element) {
  return Number(element.id.slice(4));
}