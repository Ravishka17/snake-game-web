// Snake Game - JavaScript Implementation
// Based on the Python Pygame version

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartButton = document.getElementById('restartButton');

// Game constants
const CELL_SIZE = 40;
const CELL_NUMBER = 20;
const GRID_COLOR = '#afd748';
const GRASS_COLOR = '#a7d13d';
const SNAKE_COLOR = '#425a1a';
const APPLE_COLOR = '#f00';

// Game state
let snake = [];
let direction = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameRunning = true;
let gameSpeed = 150; // ms
let lastUpdateTime = 0;
let newBlock = false;

// Initialize game
function initGame() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverOverlay.classList.remove('visible');
    
    placeApple();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Place apple at random position
function placeApple() {
    let validPosition = false;
    
    while (!validPosition) {
        apple.x = Math.floor(Math.random() * CELL_NUMBER);
        apple.y = Math.floor(Math.random() * CELL_NUMBER);
        
        // Check if apple is not on snake
        validPosition = true;
        for (const segment of snake) {
            if (segment.x === apple.x && segment.y === apple.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// Draw grass pattern
function drawGrass() {
    ctx.fillStyle = GRID_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = GRASS_COLOR;
    
    for (let row = 0; row < CELL_NUMBER; row++) {
        for (let col = 0; col < CELL_NUMBER; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillRect(
                    col * CELL_SIZE,
                    row * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }
}

// Draw snake
function drawSnake() {
    // Draw head
    const head = snake[0];
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fillRect(
        head.x * CELL_SIZE,
        head.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );
    
    // Draw body segments
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
}

// Draw apple
function drawApple() {
    ctx.fillStyle = APPLE_COLOR;
    ctx.beginPath();
    const centerX = apple.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = apple.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add some shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - radius/3, centerY - radius/3, radius/3, 0, Math.PI * 2);
    ctx.fill();
}

// Move snake
function moveSnake() {
    if (newBlock) {
        // Add new block to snake
        snake.unshift({
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        });
        newBlock = false;
    } else {
        // Move snake (remove tail, add new head)
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };
        snake.unshift(newHead);
        snake.pop();
    }
}

// Check collisions
function checkCollisions() {
    const head = snake[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= CELL_NUMBER || head.y < 0 || head.y >= CELL_NUMBER) {
        return true;
    }
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Check apple collision
function checkAppleCollision() {
    const head = snake[0];
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        scoreElement.textContent = score;
        newBlock = true;
        placeApple();
        
        // Increase speed slightly as score increases
        if (gameSpeed > 50) {
            gameSpeed = Math.max(50, 150 - score * 2);
        }
        
        return true;
    }
    return false;
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverOverlay.classList.add('visible');
}

// Game loop
function gameLoop(timestamp) {
    if (!gameRunning) {
        return;
    }
    
    // Calculate delta time for consistent game speed
    if (timestamp - lastUpdateTime > gameSpeed) {
        lastUpdateTime = timestamp;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game state
        moveSnake();
        
        if (checkCollisions()) {
            gameOver();
            return;
        }
        
        checkAppleCollision();
        
        // Draw everything
        drawGrass();
        drawApple();
        drawSnake();
    }
    
    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener('keydown', (e) => {
    // Prevent direction reversal
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});

restartButton.addEventListener('click', initGame);

// Start the game
initGame();