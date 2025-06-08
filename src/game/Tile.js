export class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.1 ? 2 : 4) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.classList.add('game__tile');
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    this.#tileElement.className = `game__tile game__tile--${v}`;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty('--x', value);
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty('--y', value);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? 'animationend' : 'transitionend',
        resolve,
        {
          once: true,
        },
      );
    });
  }
}
