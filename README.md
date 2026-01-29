# Snake Game - Web Version

A classic Snake game implemented using HTML, CSS, and JavaScript. This is a web-based recreation of the Python Pygame version.

## Features

- Classic Snake gameplay with arrow key controls
- Score tracking
- Game over detection (wall and self collision)
- Increasing difficulty as you score more points
- Responsive design
- Clean, retro-style graphics

## How to Play

1. Use the arrow keys (↑, ↓, ←, →) to control the snake
2. Eat the apples (🍎) to grow longer and increase your score
3. Avoid hitting the walls or yourself
4. The game gets faster as you score more points

## Game Controls

- **Arrow Keys**: Change snake direction
- **Restart Button**: Start a new game after game over

## Installation

No installation required! Just open the `index.html` file in any modern web browser.

## Development

To run a local development server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Files

- `index.html`: Main HTML file
- `css/style.css`: Game styling
- `js/game.js`: Game logic
- `README.md`: This file

## Game Mechanics

- **Grid**: 20x20 cells
- **Cell Size**: 40x40 pixels
- **Initial Speed**: 150ms per move
- **Max Speed**: 50ms per move (increases with score)
- **Starting Length**: 3 segments

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## License

This is a free implementation of the classic Snake game. Feel free to use, modify, and distribute as you wish.

## Credits

Inspired by the Python Pygame version from clear-code-projects/Snake