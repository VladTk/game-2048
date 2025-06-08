import { Grid } from './Grid';

export const GRID_SIZE = 4;

export class Game {
  #grid;
  #status;
  #score;

  static GAME_STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
  };

  constructor(gridElement, initialGridState = null) {
    this.#grid = new Grid(gridElement, initialGridState);
    this.#status = Game.GAME_STATUS.idle;
    this.#score = 0;
  }

  get grid() {
    return this.#grid;
  }

  get score() {
    return this.#score;
  }

  get status() {
    return this.#status;
  }

  get isGameOver() {
    return this.#status === Game.GAME_STATUS.lose;
  }

  get isWin() {
    return this.#status === Game.GAME_STATUS.win;
  }

  start() {
    this.#status = Game.GAME_STATUS.playing;
    this.spawnTiles(2);
  }

  restart() {
    this.#grid.clear();
    this.#status = Game.GAME_STATUS.idle;
    this.#score = 0;
  }

  async tryMove(direction) {
    if (this.#status !== Game.GAME_STATUS.playing) {
      return;
    }

    const { UP, DOWN, LEFT, RIGHT } = Game.DIRECTIONS;

    const moveMap = {
      [UP]: [this.canMoveUp, this.moveUp],
      [DOWN]: [this.canMoveDown, this.moveDown],
      [LEFT]: [this.canMoveLeft, this.moveLeft],
      [RIGHT]: [this.canMoveRight, this.moveRight],
    };

    const [canMove, move] = moveMap[direction] || [];

    if (!canMove?.call(this)) {
      return false;
    }

    await move.call(this);

    this.mergeTiles();

    const [newTile] = this.spawnTiles(1);

    if (
      !this.canMoveUp()
      && !this.canMoveDown()
      && !this.canMoveLeft()
      && !this.canMoveRight()
    ) {
      this.#status = Game.GAME_STATUS.lose;

      if (newTile) {
        await newTile.waitForTransition(true);
      }
    }

    return true;
  }

  canMoveUp() {
    return this.#canMove(this.#grid.cellsByColumn);
  }

  canMoveDown() {
    return this.#canMove(
      this.#grid.cellsByColumn.map((column) => [...column].reverse()),
    );
  }

  canMoveLeft() {
    return this.#canMove(this.#grid.cellsByRow);
  }

  canMoveRight() {
    return this.#canMove(
      this.#grid.cellsByRow.map((row) => [...row].reverse()),
    );
  }

  moveUp() {
    return this.#slideTiles(this.#grid.cellsByColumn);
  }

  moveDown() {
    return this.#slideTiles(
      this.#grid.cellsByColumn.map((column) => [...column].reverse()),
    );
  }

  moveLeft() {
    return this.#slideTiles(this.#grid.cellsByRow);
  }

  moveRight() {
    return this.#slideTiles(
      this.#grid.cellsByRow.map((row) => [...row].reverse()),
    );
  }

  #canMove(cells) {
    return cells.some((group) => {
      return group.some((cell, index) => {
        if (index === 0) {
          return false;
        }

        if (cell.tile == null) {
          return false;
        }

        const moveToCell = group[index - 1];

        return moveToCell.canAccept(cell.tile);
      });
    });
  }

  #slideTiles(cells) {
    return Promise.all(
      cells.flatMap((group) => {
        const promises = [];

        for (let i = 1; i < group.length; i++) {
          const cell = group[i];

          if (cell.tile == null) {
            continue;
          }

          let lastValidCell;

          for (let j = i - 1; j >= 0; j--) {
            const moveToCell = group[j];

            if (!moveToCell.canAccept(cell.tile)) {
              break;
            }
            lastValidCell = moveToCell;
          }

          if (lastValidCell != null) {
            promises.push(cell.tile.waitForTransition());

            if (lastValidCell.tile != null) {
              lastValidCell.mergeTile = cell.tile;
            } else {
              lastValidCell.tile = cell.tile;
            }
            cell.tile = null;
          }
        }

        return promises;
      }),
    );
  }

  mergeTiles() {
    let scoreGained = 0;

    this.#grid.cells.forEach((cell) => {
      const mergedValue = cell.mergeTiles();

      if (mergedValue) {
        scoreGained += mergedValue;

        if (mergedValue === 2048) {
          this.#status = Game.GAME_STATUS.win;
        }
      }
    });

    this.#score += scoreGained;
  }

  spawnTiles(count = 1) {
    const tiles = [];

    for (let i = 0; i < count; i++) {
      const spawnedTile = this.#grid.spawnTile();

      tiles.push(spawnedTile);
    }

    return tiles;
  }
}
