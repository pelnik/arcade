import Snake from '/Modules/snake.js';

const gameContentElement = document.querySelector('#game-content');

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;
const numberOfBoxes = numberOfColsForLargeScreen * numberOfRowsForLargeScreen;

let snakeStartXPos = numberOfRowsForLargeScreen;
let snakeStartYPos = numberOfColsForLargeScreen;

const boxMapToPos = {};
const posMapToBox = {};

// Box ids start from one
if (window.screen.width > largeScreenCutoff) {
  for (let i = 0; i < numberOfBoxes; i += 1) {
    const newElement = document.createElement('div');
    newElement.className = 'box';
    newElement.id = `box-${i + 1}`;
    gameContentElement.appendChild(newElement);
  }
}

// Map boxes to X and Y values and do the reverse as well
for (let i = 1; i <= numberOfBoxes; i += 1) {
  const xyObject = {};

  let x = i % numberOfColsForLargeScreen;
  const y = Math.ceil(i / numberOfColsForLargeScreen);

  if (Math.round(x) === 0) {
    x = numberOfColsForLargeScreen;
  }

  xyObject.x = x;
  xyObject.y = y;

  boxMapToPos[`box-${i}`] = xyObject;
  posMapToBox[`${x},${y}`] = `box-${i}`;
}

function getBoxNumber(element) {
  return Number(element.id.slice(4));
}

// test
new Snake();