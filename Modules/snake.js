export default class Snake {
  constructor(startX, startY, boxMaps, gridDimensions) {
    this.body = [];
    this.length = 4;
    [this.boxMapToPos, this.posMapToBox] = boxMaps;
    [this.numberOfCols, this.numberOfRows] = gridDimensions;
    this.lastMove = 'east';
    this.moveOpposites = {
      north: 'south',
      east: 'west',
      south: 'north',
      west: 'east',
    };

    this.createSnakeBody(startX, startY);
  }

  createSnakeBody(startX, startY) {
    let currentSegment = { x: startX, y: startY };
    this.body.push({ x: startX, y: startY });

    for (let i = 0; i < this.length - 1; i += 1) {
      currentSegment = {
        x: currentSegment.x - 1,
        y: currentSegment.y,
      };
      this.body.push(currentSegment);
    }

    this.drawSnake();
  }

  // Only adds the darkened squares, does not remove old ones
  // Remove old squares in logic of other functions
  drawSnake() {
    for (let i = 0; i < this.body.length; i += 1) {
      const currentSegment = this.body[i];
      const boxID = this.posMapToBox[`${currentSegment.x},${currentSegment.y}`];

      const domBox = document.querySelector(`#${boxID}`);
      domBox.classList.add('snake-square');
    }
  }

  moveSnake(direction) {
    const firstSegment = this.body[0];
    const newSegment = {};
    let actualDirection = direction;
    const oppositeOfLastMove = this.moveOpposites[this.lastMove];
    console.log('lastmove', this.lastMove, 'oppositeOfLastMove', oppositeOfLastMove);

    if (direction === null || oppositeOfLastMove === direction) {
      actualDirection = this.lastMove;
    }

    if (actualDirection === 'north') {
      newSegment.x = firstSegment.x;
      newSegment.y = firstSegment.y - 1;
    } else if (actualDirection === 'east') {
      newSegment.x = firstSegment.x + 1;
      newSegment.y = firstSegment.y;
    } else if (actualDirection === 'south') {
      newSegment.x = firstSegment.x;
      newSegment.y = firstSegment.y + 1;
    } else if (actualDirection === 'west') {
      newSegment.x = firstSegment.x - 1;
      newSegment.y = firstSegment.y;
    } else if (actualDirection === null) {
      return false;
    }

    // Returns game over check
    if (
      newSegment.x < 1
      || newSegment.x > this.numberOfCols
      || newSegment.y < 1
      || newSegment.y > this.numberOfRows
    ) {
      return true;
    }

    this.lastMove = actualDirection;
    this.body.unshift(newSegment);
    this.removeLastSegment(1);
    this.drawSnake();

    return false;
  }

  removeLastSegment(numberOfTimes) {
    for (let i = 0; i < numberOfTimes; i += 1) {
      const lastSegment = this.body.pop();

      const boxID = this.posMapToBox[`${lastSegment.x},${lastSegment.y}`];
      const domBox = document.querySelector(`#${boxID}`);
      domBox.classList.remove('snake-square');
    }
  }

  getLengthOfSnake() {
    return this.body.length;
  }
}

console.log('Snake working');
