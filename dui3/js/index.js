import Board from './board.js';
import { CANVAS_SIZE, canvas, ws, DEFAULT_COLOR } from './constants.js';
document.getElementById('pencil').classList.add('control-item-gray');
document.getElementById('size_4').classList.add('control-item-gray');
let id;
let X = null;
let Y = null;
let instrument = 'pencil';
let isDrawing = false;
let bucketColor = document.getElementById('bucketColor').value;
let penColor = document.getElementById('penColor').value;
const board = new Board(DEFAULT_COLOR);
ws.addEventListener('message', (response)=> {
  const data = JSON.parse(response.data);
  switch (data['type']) {
    case 'newID': {
      id = data['id'];
      send({ type: 'newUser', id: id });
    }
      break;
    case 'newUser': {
      if (id !== data['id']) {
        send({ type: 'resize', size: board.size, id: id });
        send({ type: 'draw', matrix: board.matrix, id: id });
      }
    }
      break;
    case 'draw': {
      if (id !== data['id']) {
        board.matrix = data['matrix'];
        board.repaint();
      }
    }
      break;
    case 'resize': {
      if (id !== data['id']) {
        resizeBoard(data['size']);
      }
    }
      break;
    case 'cursor': {
      if (id !== data['id']) {
        let div = document.getElementById('cursor' + data['id']);
        if (div == null) {
          div = document.createElement('div');
          div.innerHTML = '<img src="images/cursor.png">';
          div.style.position = 'absolute';
          div.style.top = '0';
          div.style.left = '0';
          div.style.zIndex = 2000;
          div.id = 'cursor' + data['id'];
          document.body.appendChild(div);
        }
        div.style.top = data['y'] + 'px';
        div.style.left = data['x'] + 'px';
      }
    }
      break;
    case 'close': {
      document.getElementById('cursor' + data['id']).remove();
    }
      break;
  }
});


window.addEventListener('mousemove', (event) => {
  send({ type: 'cursor', x: event.pageX, y: event.pageY, id: id });
});
window.addEventListener('unload', () => {
  send({ type: 'close', id: id });
});
window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyB':
      {
        document.getElementById('bucket').click();
      }
      break;
    case 'KeyV':
      {
        document.getElementById('pencil').click();
      }
      break;
    case 'KeyC':
      {
        if (instrument === 'pencil') {
          document.getElementById('penColor').click();
        } else {
          document.getElementById('bucketColor').click();
        }
      }
      break;
  }
});

document.getElementById('pencil').addEventListener('click', () => {
  instrument = 'pencil';
  document.getElementById('pencil').classList.add('control-item-gray');
  document.getElementById('bucket').classList.remove('control-item-gray');
});
document.getElementById('bucket').addEventListener('click', () => {
  instrument = 'bucket';
  document.getElementById('pencil').classList.remove('control-item-gray');
  document.getElementById('bucket').classList.add('control-item-gray');
});
document.getElementById('size_4').addEventListener('click', () => {
  if (board.size != 4) {
    if (confirm('Change canvas size to 4x4?')) {
      resizeBoard(4);
      send({ type: 'resize', size: board.size, id: id });
    }
  }
});
document.getElementById('size_16').addEventListener('click', () => {
  if (board.size != 16) {
    if (confirm('Change canvas size to 16x16?')) {
      resizeBoard(16);
      send({ type: 'resize', size: board.size, id: id });
    }
  }
});
document.getElementById('size_32').addEventListener('click', () => {
  if (board.size != 32) {
    if (confirm('Change canvas size to 32x32?')) {
      resizeBoard(32);
      send({ type: 'resize', size: board.size, id: id });
    }
  }
});
document.getElementById('penColor').addEventListener('input', (event) => {
  penColor = event.target.value;
}, false);
document.getElementById('bucketColor').addEventListener('input', (event) => {
  bucketColor = event.target.value;
}, false);

canvas.addEventListener('mousedown', (event) => {
  const pixelSize = CANVAS_SIZE / board.size;
  let x = Math.ceil((event.pageX - canvas.offsetLeft) / pixelSize - 1);
  x = Math.abs(x);
  let y = Math.ceil((event.pageY - canvas.offsetTop) / pixelSize - 1);
  y = Math.abs(y);
  isDrawing = true;
  if (instrument === 'pencil') {
    board.matrix[y][x] = penColor;
    board.repaint();
  } else {
    board.fillArea(x, y, board.matrix[y][x], bucketColor);
  }
  send({ type: 'draw', matrix: board.matrix, id: id });
});

canvas.addEventListener('mousemove', (event) => {
  const pixelSize = CANVAS_SIZE / board.size;
  let x = Math.ceil((event.pageX - canvas.offsetLeft) / pixelSize - 1);
  x = Math.abs(x);
  let y = Math.ceil((event.pageY - canvas.offsetTop) / pixelSize - 1);
  y = Math.abs(y);
  if (!isDrawing) {
    if (X === null) {
      X = x;
      Y = y;
      board.fillCell('gray', x, y, board.getSize());
    } else {
      if (X !== x && X < board.getSize() || Y !== y && Y < board.getSize()) {
        board.fillCell(board.getMatrixColor(Y, X), X, Y, board.getSize());
      }
      board.fillCell('gray', x, y, board.getSize());
      X = x;
      Y = y;
    }
  }
});
canvas.addEventListener('mouseleave', () => {
  if (Y < board.getSize() && X < board.getSize()) {
    board.fillCell(board.getMatrixColor(Y, X), X, Y, board.getSize());
  }
  X = null;
  Y = null;
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

function send(object) {
  if (ws.readyState != ws.CLOSING && ws.readyState != ws.CLOSED) {
    const data = JSON.stringify(object);
    ws.send(data);
  }
}
function resizeBoard(newBoardSize) {
  board.size = newBoardSize;
  switch (board.size) {
    case 4: {
      document.getElementById('size_4').classList.add('control-item-gray');
      document.getElementById('size_16').classList.remove('control-item-gray');
      document.getElementById('size_32').classList.remove('control-item-gray');
    }
      break;
    case 16: {
      document.getElementById('size_4').classList.remove('control-item-gray');
      document.getElementById('size_16').classList.add('control-item-gray');
      document.getElementById('size_32').classList.remove('control-item-gray');
    }
      break;
    case 32: {
      document.getElementById('size_4').classList.remove('control-item-gray');
      document.getElementById('size_16').classList.remove('control-item-gray');
      document.getElementById('size_32').classList.add('control-item-gray');
    }
      break;
  }
  board.createBoard(DEFAULT_COLOR);
}
