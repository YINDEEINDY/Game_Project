const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{x: 200, y: 200}];
let direction = 'RIGHT';
let food = {x: 100, y: 100};
let score = 0;
let gameOver = false;
let highScore = localStorage.getItem('snakeHighScore') || 0;

function drawSnake() {
    snake.forEach((segment, index) => {
        // Head is darker green, body segments alternate between two shades of green
        if (index === 0) {
            ctx.fillStyle = '#006400'; // Dark green for head
        } else {
            ctx.fillStyle = index % 2 === 0 ? '#32CD32' : '#228B22'; // Alternating greens for body
        }
        
        // Draw the main segment
        ctx.fillRect(segment.x, segment.y, 20, 20);
        
        // Draw eyes on the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            
            // Position eyes based on direction
            if (direction === 'RIGHT' || direction === 'LEFT') {
                ctx.fillRect(segment.x + (direction === 'RIGHT' ? 12 : 2), segment.y + 5, 4, 4);
                ctx.fillRect(segment.x + (direction === 'RIGHT' ? 12 : 2), segment.y + 12, 4, 4);
            } else {
                ctx.fillRect(segment.x + 5, segment.y + (direction === 'DOWN' ? 12 : 2), 4, 4);
                ctx.fillRect(segment.x + 12, segment.y + (direction === 'DOWN' ? 12 : 2), 4, 4);
            }
            
            // Add black pupils
            ctx.fillStyle = 'black';
            if (direction === 'RIGHT' || direction === 'LEFT') {
                ctx.fillRect(segment.x + (direction === 'RIGHT' ? 14 : 4), segment.y + 6, 2, 2);
                ctx.fillRect(segment.x + (direction === 'RIGHT' ? 14 : 4), segment.y + 13, 2, 2);
            } else {
                ctx.fillRect(segment.x + 6, segment.y + (direction === 'DOWN' ? 14 : 4), 2, 2);
                ctx.fillRect(segment.x + 13, segment.y + (direction === 'DOWN' ? 14 : 4), 2, 2);
            }
        }
    });
}

function moveSnake() {
    if (gameOver) return;
    
    const head = {...snake[0]};
    switch(direction) {
        case 'RIGHT': head.x += 20; break;
        case 'LEFT': head.x -= 20; break;
        case 'UP': head.y -= 20; break;
        case 'DOWN': head.y += 20; break;
    }
    
    // Check for collision with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        handleGameOver();
        return;
    }
    
    // Check for collision with self
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            handleGameOver();
            return;
        }
    }
    
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
        }
        generateFood();
        // Play eating sound
        playSound('eat');
    } else {
        snake.pop();
    }
}

function generateFood() {
    // Generate new food position
    let newFood;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };
        
        // Check if the new food is on the snake
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFood;
}

function drawFood() {
    // Draw apple-like food
    ctx.fillStyle = '#FF0000'; // Red apple
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw stem
    ctx.fillStyle = '#654321'; // Brown stem
    ctx.fillRect(food.x + 9, food.y + 2, 2, 4);
    
    // Draw leaf
    ctx.fillStyle = '#00AA00'; // Green leaf
    ctx.beginPath();
    ctx.ellipse(food.x + 13, food.y + 4, 3, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
}

function handleGameOver() {
    gameOver = true;
    playSound('gameOver');
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
}

function playSound(type) {
    // Sound effects can be implemented here if needed
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.fillStyle = '#f8f8f8';
    for (let i = 0; i < canvas.width / 20; i++) {
        for (let j = 0; j < canvas.height / 20; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(i * 20, j * 20, 20, 20);
            }
        }
    }
    
    drawSnake();
    drawFood();
    drawScore();
    
    if (gameOver) {
        drawGameOver();
    } else {
        moveSnake();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const SPACE = 32;
    const KEY_W = 87;
    const KEY_A = 65;
    const KEY_S = 83;
    const KEY_D = 68;

    if (gameOver && keyPressed === SPACE) {
        // Restart game
        snake = [{x: 200, y: 200}];
        direction = 'RIGHT';
        score = 0;
        gameOver = false;
        generateFood();
        return;
    }
    
    // Prevent reversing direction directly
    switch(keyPressed) {
        case LEFT:
        case KEY_A:
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case UP:
        case KEY_W:
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case RIGHT:
        case KEY_D:
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case DOWN:
        case KEY_S:
            if (direction !== 'UP') direction = 'DOWN';
            break;
    }
}

document.addEventListener('keydown', changeDirection);

// Initialize game
generateFood();
const gameLoop = setInterval(update, 100);

// Add touch controls for mobile devices
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    if (gameOver) {
        // Restart game on tap when game over
        snake = [{x: 200, y: 200}];
        direction = 'RIGHT';
        score = 0;
        gameOver = false;
        generateFood();
        return;
    }
    
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // Determine swipe direction based on which axis had the larger change
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && direction !== 'LEFT') {
            direction = 'RIGHT';
        } else if (dx < 0 && direction !== 'RIGHT') {
            direction = 'LEFT';
        }
    } else {
        // Vertical swipe
        if (dy > 0 && direction !== 'UP') {
            direction = 'DOWN';
        } else if (dy < 0 && direction !== 'DOWN') {
            direction = 'UP';
        }
    }
    
    // Prevent default to avoid scrolling
    e.preventDefault();
}, { passive: false });