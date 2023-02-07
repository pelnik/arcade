export default class Snake {
  constructor(startX, startY, boxMaps) {
    this.body = [];
    this.length = 4;
    [this.boxMapToPos, this.posMapToBox] = boxMaps;

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
}

console.log('Snake working');