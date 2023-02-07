import Snake from './Modules/snake.js';

const gameContentElement = document.querySelector('#game-content');

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;
const numberOfBoxes = numberOfColsForLargeScreen * numberOfRowsForLargeScreen;

let snakeStartXPos = 20;
let snakeStartYPos = 14;

let stateGameOver = false;
let stateRunning = 'not running';

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

let snake = new Snake(
  snakeStartXPos,
  snakeStartYPos,
  [boxMapToPos, posMapToBox],
  [numberOfColsForLargeScreen, numberOfRowsForLargeScreen]
);

// Keypress Monitoring logic
let currentKeypress = null;
const keypressStack = [];
const keypressDict = {
  38: 'north',
  39: 'east',
  40: 'south',
  37: 'west',
};

function keydownHandler(evt) {
  let direction;
  if (evt.keyCode in keypressDict) {
    direction = keypressDict[evt.keyCode];
  } else {
    return null;
  }

  if (!(keypressStack.includes(direction))) {
    keypressStack.push(direction);
    currentKeypress = direction;
  }

  return null;
}

function keyupHandler(evt) {
  let direction;
  if (evt.keyCode in keypressDict) {
    direction = keypressDict[evt.keyCode];
  } else {
    return null;
  }

  const stackIndex = keypressStack.indexOf(direction);

  if (stackIndex !== -1) {
    keypressStack.splice(stackIndex, 1);
  }

  if (keypressStack.length === 0) {
    currentKeypress = null;
  } else {
    currentKeypress = keypressStack[keypressStack.length - 1];
  }

  console.log('stack', keypressStack, 'currentkeypress', currentKeypress);

  return null;
}

window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyupHandler);

// Game loop logic
let gameLoop;

function runGameLoop() {
  console.log('gameloop running');

  const checkGameOver = snake.moveSnake(currentKeypress);
  if (checkGameOver === true) {
    stateGameOver = true;
    stateRunning = 'not running';
    clearInterval(gameLoop);
  }
}

function startHandler() {
  if (stateRunning !== 'running') {
    gameLoop = setInterval(runGameLoop, 500);
    stateRunning = 'running';
    stateGameOver = false;
  }
}

const startButton = document.querySelector('#start-button');

startButton.addEventListener('click', startHandler);
