import { Game } from '../game/Game.js';

const gameField = document.querySelector('.game__field');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game__score');
const loseMessage = document.querySelector('.message--lose');
const winMessage = document.querySelector('.message--win');
const startMessage = document.querySelector('.message--start');

const game = new Game(gameField);
const { DIRECTIONS } = Game;

function handleButtonClick() {
  if (game.status === Game.GAME_STATUS.idle) {
    startGame();
  } else {
    restartGame();
  }
}

async function handleInput(e) {
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

  const moved = await game.tryMove(direction);

  if (moved) {
    updateScore();

    if (game.isWin) {
      winMessage.classList.remove('hidden');

      return;
    }

    if (game.isGameOver) {
      loseMessage.classList.remove('hidden');

      return;
    }
  }

  setupInput();
}

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
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
}

button.addEventListener('click', handleButtonClick);
