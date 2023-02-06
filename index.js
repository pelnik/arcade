const gameContentElement = document.querySelector('#game-content');

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;


if (window.screen.width > largeScreenCutoff) {
  for (let i = 0; i < numberOfColsForLargeScreen * numberOfRowsForLargeScreen; i++) {
    const newElement = document.createElement('div');
    newElement.className = 'box';
    gameContentElement.appendChild(newElement);
  }
}