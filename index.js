import Snake from './Modules/snake.js';

const largeScreenCutoff = 768;
const numberOfColsForLargeScreen = 30;
const numberOfRowsForLargeScreen = 14;
const numberOfBoxes = numberOfColsForLargeScreen * numberOfRowsForLargeScreen;

const snakeStartXPos = 15;
const snakeStartYPos = 7;

const gameSpeeds = {
  Easy: 150,
  Medium: 100,
  Hard: 75,
};

let stateRunning = 'not running';
let gameSpeed = gameSpeeds.Medium;
let stateHasStartedOnce = false;

const maxApples = 40;
const currentApples = [];
let growthIndicator = 0;
let points = 0;
const pointsHistory = [];

const boxMapToPos = {};
const posMapToBox = {};

const gameWall = document.querySelector('#game-wall');
const gameContentElement = document.querySelector('#game-content');
const startButton = document.querySelector('#start-button');
const pointsElement = document.querySelector('#points');
const difficultyElement = document.querySelector('#select-difficulty');
const highestPointsElement = document.querySelector('#highest-points');
const averagePointsElement = document.querySelector('#average-points');
const lowestPointsElement = document.querySelector('#lowest-points');

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
);

// Keypress Monitoring logic
let currentKeypress = null;
let lastKeypress = null;
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
    lastKeypress = keypressDict[evt.keyCode];
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

function generateApples() {
  const randomNum = Math.random();

  if (randomNum <= 0.1 && currentApples.length < maxApples) {
    addApple();
  }
}

function removeApple(index) {
  const currentApple = currentApples[index];
  const boxElement = getBoxElement(currentApple);

  boxElement.classList.remove('apple-square');

  currentApples.splice(index, 1);

  points += 1;
  pointsElement.innerText = `Points: ${points}`;
  pointsElement.classList.add('point-shake');
  setTimeout(() => {
    pointsElement.classList.remove('point-shake');
  },
  500,
  );

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

function deleteApple(apple) {
  const boxElement = getBoxElement(apple);

  boxElement.classList.remove('apple-square');
}

function clearApples() {
  while (currentApples.length > 0) {
    const currentApple = currentApples.pop();
    deleteApple(currentApple);
  }
}

// Stats handling
function addStatHistory(score) {
  pointsHistory.push(score);
}

function updateStatsElement() {
  const highestPoints = Math.max(...pointsHistory);
  const averagePoints = pointsHistory.reduce((total, gamePoints) => {
    let acc = total;
    acc += gamePoints;

    return acc;
  }) / pointsHistory.length;
  const lowestPoints = Math.min(...pointsHistory);

  lowestPointsElement.innerText = `Lowest Points: ${lowestPoints}`;
  averagePointsElement.innerText = `Average Points: ${averagePoints.toFixed(2)}`;
  highestPointsElement.innerText = `Highest Points: ${highestPoints}`;
}

function clearCurrentPoints() {
  points = 0;
  pointsElement.innerText = `Points: ${points}`;
}

// Game loop logic
let gameLoop;

function endGame() {
  stateRunning = 'not running';
  gameWall.classList.add('gameEnd');
  startButton.classList.add('start-button-not-started');
  clearInterval(gameLoop);
  addStatHistory(points);
  updateStatsElement();
}

function runGameLoop() {
  const checkGameOver = snake.moveSnake(currentKeypress, growthIndicator, lastKeypress);
  growthIndicator = 0;
  checkIfAppleCollision(snake);

  generateApples();
  if (checkGameOver === true) {
    endGame();
  }
}

function startGame() {
  clearCurrentPoints();
  gameWall.classList.remove('gameEnd');
  startButton.classList.remove('start-button-not-started');
  lastKeypress = null;
  gameLoop = setInterval(runGameLoop, gameSpeed);
  stateRunning = 'running';
  stateHasStartedOnce = true;
}

// used when the game is not running
function restartGame() {
  snake.deleteSnake();
  clearApples();

  snake = new Snake(
    snakeStartXPos,
    snakeStartYPos,
    [boxMapToPos, posMapToBox],
    [numberOfColsForLargeScreen, numberOfRowsForLargeScreen],
  );

  startGame();
}

function startHandler() {
  if (stateRunning !== 'running' && stateHasStartedOnce === false) {
    startGame();
  } else if (stateRunning !== 'running' && stateHasStartedOnce === true) {
    restartGame();
  }
}

startButton.addEventListener('click', startHandler);

// Event listener setup for difficulty
function changeDifficulty(evt) {
  gameSpeed = gameSpeeds[evt.target.value];
}

difficultyElement.addEventListener('change', changeDifficulty);
