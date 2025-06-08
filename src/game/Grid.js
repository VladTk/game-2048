import { Cell } from './Cell';
import { GRID_SIZE } from './Game';
import { Tile } from './Tile';

export class Grid {
  #cells;
  #gridElement;

  constructor(gridElement, initialGridState = null) {
    this.#gridElement = gridElement;
    gridElement.style.setProperty('--grid-size', GRID_SIZE);

    this.#cells = this.#createCellElements(gridElement).map(
      (cellElement, index) => {
        return new Cell(
          cellElement,
          index % GRID_SIZE,
          Math.floor(index / GRID_SIZE),
        );
      },
    );

    if (initialGridState) {
      this.#populateInitialState(initialGridState);
    }
  }

  get gridElement() {
    return this.#gridElement;
  }

  get cells() {
    return this.#cells;
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);

    return this.#emptyCells[randomIndex];
  }

  spawnTile() {
    const cell = this.randomEmptyCell();

    if (!cell) {
      return;
    }

    const tile = new Tile(this.gridElement);

    cell.tile = tile;

    return tile;
  }

  clear() {
    this.#cells.forEach((cell) => {
      if (cell.tile) {
        cell.tile.remove();
        cell.tile = null;
      }

      if (cell.mergeTile) {
        cell.mergeTile.remove();
        cell.mergeTile = null;
      }
    });
  }

  #createCellElements(gridElement) {
    const cells = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const cell = document.createElement('div');

      cell.classList.add('game__cell');
      cells.push(cell);
      gridElement.append(cell);
    }

    return cells;
  }

  #populateInitialState(initialState) {
    for (let y = 0; y < initialState.length; y++) {
      for (let x = 0; x < initialState[y].length; x++) {
        const value = initialState[y][x];

        if (value) {
          const cell = this.#cells.find((c) => c.x === x && c.y === y);
          const tile = new Tile(this.#gridElement, value);

          cell.tile = tile;
        }
      }
    }
  }
}
