import { Game } from '../game/Game.js';

const gameField = document.querySelector('.game__field');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game__score');
const loseMessage = document.querySelector('.message--lose');
const winMessage = document.querySelector('.message--win');
const startMessage = document.querySelector('.message--start');

const game = new Game(gameField);
const { DIRECTIONS } = Game;

let touchStartX = null;
let touchStartY = null;
const SWIPE_THRESHOLD = 30;

button.addEventListener('click', handleButtonClick);

function handleButtonClick() {
  if (game.status === Game.GAME_STATUS.idle) {
    startGame();
  } else {
    restartGame();
  }
}

function handleTouchStart(e) {
  e.preventDefault();

  const touch = e.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

async function handleTouchEnd(e) {
  e.preventDefault();

  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
    return;
  }

  let direction;

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
  } else {
    direction = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
  }

  await processMove(direction);
}

async function processMove(direction) {
  const moved = await game.tryMove(direction);

  if (moved) {
    updateScore();

    if (game.isWin) {
      winMessage.classList.remove('hidden');
      removeTouchListeners();

      return;
    }

    if (game.isGameOver) {
      loseMessage.classList.remove('hidden');
      removeTouchListeners();

      return;
    }
  }

  setupInput();
}

async function handleKeyDown(e) {
  const direction = {
    ArrowUp: DIRECTIONS.UP,
    ArrowDown: DIRECTIONS.DOWN,
    ArrowLeft: DIRECTIONS.LEFT,
    ArrowRight: DIRECTIONS.RIGHT,
  }[e.key];

  if (!direction) {
    setupInput();

    return;
  }

  await processMove(direction);
}

function setupInput() {
  window.addEventListener('keydown', handleKeyDown, { once: true });
}

function updateScore() {
  gameScore.textContent = game.score;
}

function startGame() {
  button.classList.remove('button--start');
  button.classList.add('button--restart');
  button.textContent = 'Restart';
  startMessage.classList.add('hidden');

  game.start();
  setupInput();

  gameField.addEventListener('touchstart', handleTouchStart);
  gameField.addEventListener('touchend', handleTouchEnd);
}

function restartGame() {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');

  button.classList.remove('button--restart');
  button.classList.add('button--start');
  button.textContent = 'Start';

  game.restart();
  updateScore();
  removeTouchListeners();
}

function removeTouchListeners() {
  gameField.removeEventListener('touchstart', handleTouchStart);
  gameField.removeEventListener('touchend', handleTouchEnd);
}
