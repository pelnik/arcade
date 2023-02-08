import Snake from './Modules/snake.js';

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 40;
const numberOfRowsForLargeScreen = 28;
const numberOfBoxes = numberOfColsForLargeScreen * numberOfRowsForLargeScreen;

let snakeStartXPos = 20;
let snakeStartYPos = 14;

let stateGameOver = false;
let stateRunning = 'not running';
let gameSpeed = 100;
let stateHasStartedOnce = false;

const maxApples = 40;
const currentApples = [];
let growthIndicator = 0;
let points = 0;

const boxMapToPos = {};
const posMapToBox = {};

const gameContentElement = document.querySelector('#game-content');
const pointsElement = document.querySelector('#points');

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

// Pass in an object with .x and .y properties to get the box element
function getBoxElement(xyObject) {
  const boxId = posMapToBox[`${xyObject.x},${xyObject.y}`];
  const boxElement = document.querySelector(`#${boxId}`);

  return boxElement;
}

let snake = new Snake(
  snakeStartXPos,
  snakeStartYPos,
  [boxMapToPos, posMapToBox],
  [numberOfColsForLargeScreen, numberOfRowsForLargeScreen],
)

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

  return null;
}

window.addEventListener('keydown', keydownHandler);
window.addEventListener('keyup', keyupHandler);

// This will handle the logic of the apples
function generateApples() {
  const randomNum = Math.random();

  if (randomNum <= 0.25 && currentApples.length < maxApples) {
    addApple();
  }
}

function addApple() {
  let flag = false;

  while (flag === false) {
    const appleLoc = {};
    appleLoc.x = Math.ceil(Math.random() * numberOfColsForLargeScreen);
    appleLoc.y = Math.ceil(Math.random() * numberOfRowsForLargeScreen);

    if (snake.checkCollisionWithBody(appleLoc) === false) {
      flag = true;
      const boxId = posMapToBox[`${appleLoc.x},${appleLoc.y}`];
      const boxElement = document.querySelector(`#${boxId}`);

      boxElement.classList.add('apple-square');
      currentApples.push(appleLoc);
    }
  }
}

function removeApple(index) {
  const currentApple = currentApples[index];
  const boxElement = getBoxElement(currentApple);

  boxElement.classList.remove('apple-square');

  currentApples.splice(index, 1);
  points += 1;
  pointsElement.innerText = `Points: ${points}`;
  growthIndicator = 1;
}

function checkIfAppleCollision(gameSnake) {
  for (let i = 0; i < currentApples.length; i += 1) {
    const newSnakeSegment = gameSnake.getSnakeSegments()[0];
    const apple = currentApples[i];

    if (apple.x === newSnakeSegment.x && apple.y === newSnakeSegment.y) {
      removeApple(i);
      break;
    }
  }
}

// Game loop logic
let gameLoop;

function runGameLoop() {
  console.log('gameloop running');

  const checkGameOver = snake.moveSnake(currentKeypress, growthIndicator);
  growthIndicator = 0;
  checkIfAppleCollision(snake);

  generateApples();
  if (checkGameOver === true) {
    stateGameOver = true;
    stateRunning = 'not running';
    clearInterval(gameLoop);
  }
}

function restartGame() {
  snake.deleteSnake();

  snake = new Snake(
    snakeStartXPos,
    snakeStartYPos,
    [boxMapToPos, posMapToBox],
    [numberOfColsForLargeScreen, numberOfRowsForLargeScreen],
  );

  gameLoop = setInterval(runGameLoop, gameSpeed);
  stateRunning = 'running';
  stateGameOver = false;
  stateHasStartedOnce = true;
}

function startHandler() {
  if (stateRunning !== 'running' && stateHasStartedOnce === false) {
    gameLoop = setInterval(runGameLoop, gameSpeed);
    stateRunning = 'running';
    stateGameOver = false;
    stateHasStartedOnce = true;
  } else if (stateRunning !== 'running' && stateHasStartedOnce === true) {
    restartGame();
  }
}

const startButton = document.querySelector('#start-button');

startButton.addEventListener('click', startHandler);
