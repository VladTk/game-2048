# 2048 Game 🎮

## Description

A browser-based implementation of the classic 2048 puzzle game. Built using modern JavaScript (ES6+) and object-oriented architecture, the game offers smooth gameplay, support for animations and keyboard/touch controls, and a clean modular structure for easy maintenance and future extension.

The goal of the game is to combine tiles with the same value by sliding them across a 4×4 grid to reach the number 2048.

## Live Demo

Play the game online: [2048 Game Demo](https://vladtk.github.io/game-2048/)

## Technologies Used

- HTML5
- CSS3/SCSS
- JavaScript (ES6+)
- DOM API
- Git


## Features

* **Responsive Design:** Fully responsive grid and UI, playable on both desktop and mobile devices.
  All sizing and spacing use **vmin** units to ensure consistent appearance across different screen sizes and orientations.

* **Object-Oriented Architecture:** The codebase is split into four core classes:
  - **Game:** Main game logic and state management
  - **Grid:** Handles grid generation and cell placement
  - **Cell:** Represents individual grid cells
  - **Tile:** Manages tile values, transitions, and merging

* **Animations:** Smooth movement and merging animations.

* **Keyboard Controls:** Arrow key support for tile movement.

* **Touch Support:** Mobile gesture support for swiping tiles.


## Getting Started

To run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/VladTk/game-2048.git
cd game-2048
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm start
```

## Preview
[![Screenshot-2025-06-09-002155.png](https://i.postimg.cc/c4bTKLgc/Screenshot-2025-06-09-002155.png)](https://postimg.cc/D811HFcW)
