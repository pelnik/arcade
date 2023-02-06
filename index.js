import Snake from '/Modules/snake.js';

const gameContentElement = document.querySelector('#game-content');

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;
const numberOfBoxes = 40 * 28;

let snakeStartXPos = numberOfRowsForLargeScreen;
let snakeStartYPos = numberOfColsForLargeScreen;

const boxMapToPos = {};

// Box ids start from one
if (window.screen.width > largeScreenCutoff) {
  for (let i = 0; i < numberOfBoxes; i += 1) {
    const newElement = document.createElement('div');
    newElement.className = 'box';
    newElement.id = `box-${i + 1}`;
    gameContentElement.appendChild(newElement);
  }
}

// Map boxes to X and Y values
for (let i = 1; i <= numberOfBoxes; i += 1) {
  const xyObject = {};

  xyObject.x = i % numberOfColsForLargeScreen;
  xyObject.y = Math.ceil(i / numberOfRowsForLargeScreen);

  boxMapToPos[`box-${i}`] = xyObject;
}

console.log(boxMapToPos);

// Need to actually reverse map this somehow

function getBoxNumber(element) {
  return Number(element.id.slice(4));
}


new Snake();