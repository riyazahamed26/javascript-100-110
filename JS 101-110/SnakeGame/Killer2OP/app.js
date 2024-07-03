const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const blockSize = 20;
const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{x: 4, y: 4}];
let direction = {x: 1, y: 0};
let food = {x: 15, y: 15};
let score = 0;
let gameover = false;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
  if (gameover) {
    showGameOver();
    return;
  }

  setTimeout(() => {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    checkCollision();
    gameLoop();
  }, 100);
}

function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

function moveSnake() {
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
  });
}

function changeDirection(event) {
  const {keyCode} = event;
  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyCode === 37 && !goingRight) {
    direction = {x: -1, y: 0};
  } else if (keyCode === 38 && !goingDown) {
    direction = {x: 0, y: -1};
  } else if (keyCode === 39 && !goingLeft) {
    direction = {x: 1, y: 0};
  } else if (keyCode === 40 && !goingUp) {
    direction = {x: 0, y: 1};
  }
}

function checkCollision() {
  const head = snake[0];

  // Check wall collision
  if (head.x < 0 || head.x >= canvas.width / blockSize || head.y < 0 || head.y >= canvas.height / blockSize) {
    gameover = true;
  }

  // Check self collision
  for (let i = 4; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameover = true;
    }
  }
}

function showGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '40px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function placeFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / blockSize)),
      y: Math.floor(Math.random() * (canvas.height / blockSize))
    };
    let overlap = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!overlap) break;
  }
  food = newFood;
}

gameLoop();
