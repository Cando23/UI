import { CANVAS_SIZE, ctx } from './constants.js';
export default class Board {
  constructor(color) {
    this.size = 4;
    this.matrix = null;
    this.createBoard(color);
  }
  getSize() {
    return this.size;
  }
  getMatrixColor(x, y) {
    return this.matrix[x][y];
  }
  createBoard(color) {
    this.matrix = [];
    for (let i = 0; i < this.size; i++) {
      this.matrix.push([]);
      for (let j = 0; j < this.size; j++) {
        this.matrix[i].push(color);
      }
    }
    this.repaint();
  }
  fillCell(color, x, y, fieldSize) {
    const pixelSize = CANVAS_SIZE / fieldSize;
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
  repaint() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.fillCell(this.matrix[i][j], j, i, this.size);
      }
    }
  }
  fillArea(x, y, color, newColor) {
    this.matrix[y][x] = newColor;

    this.fillCell(newColor, x, y, this.size);

    if (y - 1 >= 0 && this.matrix[y - 1][x] === color) {
      if (color !== newColor) {
        this.fillArea(x, y - 1, color, newColor);
      }
    }

    if (y + 1 < this.size && this.matrix[y + 1][x] === color) {
      if (color !== newColor) {
        this.fillArea(x, y + 1, color, newColor);
      }
    }

    if (x - 1 >= 0 && this.matrix[y][x - 1] === color) {
      if (color !== newColor) {
        this.fillArea(x - 1, y, color, newColor);
      }
    }

    if (x + 1 < this.size && this.matrix[y][x + 1] === color) {
      if (color !== newColor) {
        this.fillArea(x + 1, y, color, newColor);
      }
    }
  }
}
