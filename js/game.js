// Snake Game - Enhanced Version with Original Assets
// Based on the Python Pygame version with all original graphics

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartButton = document.getElementById('restartButton');
const crunchSound = document.getElementById('crunchSound');
const mobileInstructions = document.getElementById('mobileInstructions');
const startGameButton = document.getElementById('startGameButton');

// Game constants
const CELL_SIZE = 40;
const CELL_NUMBER = 20;
const GRID_COLOR = '#afd748';
const GRASS_COLOR = '#a7d13d';

// Load all snake graphics
const snakeGraphics = {
    head_up: new Image(),
    head_down: new Image(),
    head_right: new Image(),
    head_left: new Image(),
    
    tail_up: new Image(),
    tail_down: new Image(),
    tail_right: new Image(),
    tail_left: new Image(),
    
    body_vertical: new Image(),
    body_horizontal: new Image(),
    
    body_tr: new Image(),
    body_tl: new Image(),
    body_br: new Image(),
    body_bl: new Image()
};

// Load apple graphic
const appleGraphic = new Image();

// Load all graphics
function loadGraphics() {
    snakeGraphics.head_up.src = 'assets/graphics/head_up.png';
    snakeGraphics.head_down.src = 'assets/graphics/head_down.png';
    snakeGraphics.head_right.src = 'assets/graphics/head_right.png';
    snakeGraphics.head_left.src = 'assets/graphics/head_left.png';
    
    snakeGraphics.tail_up.src = 'assets/graphics/tail_up.png';
    snakeGraphics.tail_down.src = 'assets/graphics/tail_down.png';
    snakeGraphics.tail_right.src = 'assets/graphics/tail_right.png';
    snakeGraphics.tail_left.src = 'assets/graphics/tail_left.png';
    
    snakeGraphics.body_vertical.src = 'assets/graphics/body_vertical.png';
    snakeGraphics.body_horizontal.src = 'assets/graphics/body_horizontal.png';
    
    snakeGraphics.body_tr.src = 'assets/graphics/body_tr.png';
    snakeGraphics.body_tl.src = 'assets/graphics/body_tl.png';
    snakeGraphics.body_br.src = 'assets/graphics/body_br.png';
    snakeGraphics.body_bl.src = 'assets/graphics/body_bl.png';
    
    appleGraphic.src = 'assets/graphics/apple.png';
}

// Game state
let snake = [];
let direction = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameRunning = true;
let gameSpeed = 150; // ms
let lastUpdateTime = 0;
let newBlock = false;
let currentHeadGraphic = null;
let currentTailGraphic = null;

// Initialize game
function initGame() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    direction = { x: 1, y: 0 }; // Start moving right by default
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverOverlay.classList.remove('visible');
    gameSpeed = 150; // Reset speed to initial (slower) value
    
    placeApple();
    updateHeadGraphics();
    updateTailGraphics();
    
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

// Update head graphics based on direction
function updateHeadGraphics() {
    if (direction.x === -1 && direction.y === 0) {
        currentHeadGraphic = snakeGraphics.head_left;
    } else if (direction.x === 1 && direction.y === 0) {
        currentHeadGraphic = snakeGraphics.head_right;
    } else if (direction.x === 0 && direction.y === -1) {
        currentHeadGraphic = snakeGraphics.head_up;
    } else if (direction.x === 0 && direction.y === 1) {
        currentHeadGraphic = snakeGraphics.head_down;
    }
}

// Update tail graphics based on direction
function updateTailGraphics() {
    if (snake.length >= 2) {
        const tailDirection = {
            x: snake[snake.length - 2].x - snake[snake.length - 1].x,
            y: snake[snake.length - 2].y - snake[snake.length - 1].y
        };
        
        // The tail should point in the direction AWAY from the previous segment
        // If previous segment is to the right of tail (x=1), tail should point right
        // If previous segment is to the left of tail (x=-1), tail should point left
        // If previous segment is below tail (y=1), tail should point down
        // If previous segment is above tail (y=-1), tail should point up
        if (tailDirection.x === 1 && tailDirection.y === 0) {
            // Previous segment is to the right, tail should point right
            currentTailGraphic = snakeGraphics.tail_right;
        } else if (tailDirection.x === -1 && tailDirection.y === 0) {
            // Previous segment is to the left, tail should point left
            currentTailGraphic = snakeGraphics.tail_left;
        } else if (tailDirection.x === 0 && tailDirection.y === 1) {
            // Previous segment is below, tail should point down
            currentTailGraphic = snakeGraphics.tail_down;
        } else if (tailDirection.x === 0 && tailDirection.y === -1) {
            // Previous segment is above, tail should point up
            currentTailGraphic = snakeGraphics.tail_up;
        }
    }
}

// Draw snake with proper graphics
function drawSnake() {
    // Draw head
    const head = snake[0];
    if (currentHeadGraphic && currentHeadGraphic.complete) {
        ctx.drawImage(
            currentHeadGraphic,
            head.x * CELL_SIZE,
            head.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
    
    // Draw body segments
    for (let i = 1; i < snake.length - 1; i++) {
        const segment = snake[i];
        const previousSegment = snake[i + 1];
        const nextSegment = snake[i - 1];
        
        const previousDirection = {
            x: previousSegment.x - segment.x,
            y: previousSegment.y - segment.y
        };
        
        const nextDirection = {
            x: nextSegment.x - segment.x,
            y: nextSegment.y - segment.y
        };
        
        // Determine which body graphic to use
        let bodyGraphic = null;
        
        if (previousDirection.x === nextDirection.x) {
            // Vertical body
            bodyGraphic = snakeGraphics.body_vertical;
        } else if (previousDirection.y === nextDirection.y) {
            // Horizontal body
            bodyGraphic = snakeGraphics.body_horizontal;
        } else {
            // Corner pieces
            if ((previousDirection.x === -1 && nextDirection.y === -1) || 
                (previousDirection.y === -1 && nextDirection.x === -1)) {
                bodyGraphic = snakeGraphics.body_tl;
            } else if ((previousDirection.x === -1 && nextDirection.y === 1) || 
                       (previousDirection.y === 1 && nextDirection.x === -1)) {
                bodyGraphic = snakeGraphics.body_bl;
            } else if ((previousDirection.x === 1 && nextDirection.y === -1) || 
                       (previousDirection.y === -1 && nextDirection.x === 1)) {
                bodyGraphic = snakeGraphics.body_tr;
            } else if ((previousDirection.x === 1 && nextDirection.y === 1) || 
                       (previousDirection.y === 1 && nextDirection.x === 1)) {
                bodyGraphic = snakeGraphics.body_br;
            }
        }
        
        if (bodyGraphic && bodyGraphic.complete) {
            ctx.drawImage(
                bodyGraphic,
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    
    // Draw tail
    if (snake.length > 1 && currentTailGraphic && currentTailGraphic.complete) {
        const tail = snake[snake.length - 1];
        ctx.drawImage(
            currentTailGraphic,
            tail.x * CELL_SIZE,
            tail.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
}

// Draw apple
function drawApple() {
    if (appleGraphic.complete) {
        ctx.drawImage(
            appleGraphic,
            apple.x * CELL_SIZE,
            apple.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );
    }
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
        
        // Play crunch sound
        crunchSound.currentTime = 0;
        crunchSound.play();
        
        // Increase speed slightly as score increases (more gradual)
        if (gameSpeed > 80) {
            gameSpeed = Math.max(80, 150 - score * 0.5);
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
        updateHeadGraphics();
        updateTailGraphics();
        
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

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Detect swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            // Swipe left
            if (direction.x !== 1) {
                direction = { x: -1, y: 0 };
            }
        } else {
            // Swipe right
            if (direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            // Swipe up
            if (direction.y !== 1) {
                direction = { x: 0, y: -1 };
            }
        } else {
            // Swipe down
            if (direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
        }
    }
}, false);

// Fix restart button
restartButton.addEventListener('click', () => {
    initGame();
});

// Also add click event for mobile
restartButton.addEventListener('touchend', (e) => {
    e.preventDefault();
    initGame();
});

// Load graphics and start the game
loadGraphics();

// Check if mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize game with mobile instructions
if (isMobileDevice()) {
    mobileInstructions.classList.remove('hidden');
    startGameButton.addEventListener('click', () => {
        mobileInstructions.classList.add('hidden');
        initGame();
    });
    startGameButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        mobileInstructions.classList.add('hidden');
        initGame();
    });
} else {
    // Desktop - start game immediately
    mobileInstructions.classList.add('hidden');
    initGame();
}