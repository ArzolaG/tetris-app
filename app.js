document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");

    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
    let nextRandom = 0;
    let score = 0;
    let timer;

    //The Tetrominoes
    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
    ];

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    ];

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ];

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    ];

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //Select random tetrominoe
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //Draw the tetrominoe
    const draw = () => {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("tetrominoe");
        });
    };

    //undraw the shape
    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("tetrominoe");
        });
    }

    //Tetrominoe moves down every second
    // timer = setInterval(moveDown, 1000);

    //Listen to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener("keydown", control);

    function moveDown() {
        undraw();
        currentPosition += GRID_WIDTH;
        draw();
        freeze();
    }

    //Freeze function
    function freeze() {
        if (current.some((index) => squares[currentPosition + index + GRID_WIDTH].classList.contains("taken"))) {
            current.forEach((index) => squares[currentPosition + index].classList.add("taken"));

            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            updateScore();
            draw();
            displayShape();
            gameOver();
        }
    }

    //left move
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some((index) => (currentPosition + index) % GRID_WIDTH === 0);

        if (!isAtLeftEdge) {
            currentPosition -= 1;
        }

        if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1;
        }

        draw();
    }

    //right move
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some((index) => (currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1);

        if (!isAtRightEdge) {
            currentPosition += 1;
        }

        if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1;
        }

        draw();
    }

    //rotate tetrominoe
    function rotate() {
        undraw();
        currentRotation++;

        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //show next tetrominoe
    const displaySquares = document.querySelectorAll(".display-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    const upNext = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetrominoe */,
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* zTetrominoe */,
        [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetrominoe */,
        [0, 1, displayWidth, displayWidth + 1] /* oTetrominoe */,
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetrominoe */,
    ];

    //display the shape
    function displayShape() {
        displaySquares.forEach((square) => {
            square.classList.remove("tetrominoe");
        });
        upNext[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add("tetrominoe");
        });
    }

    //add functionality to the start button
    let flag = 0;
    startButton.addEventListener("click", () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        } else {
            if (flag === 0) {
                nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            }
            flag = 1;
            draw();
            timer = setInterval(moveDown, 1000);
            displayShape();
        }
    });

    //add score
    function updateScore() {
        for (let i = 0; i < GRID_SIZE - 1; i += GRID_WIDTH) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every((index) => squares[index].classList.contains("taken"))) {
                score += 100;
                scoreDisplay.innerHTML = score;

                row.forEach((index) => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetrominoe");
                });

                const squaresRemoved = squares.splice(i, GRID_WIDTH);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => grid.appendChild(cell));
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
            scoreDisplay.innerHTML = "GAME OVER";
            clearInterval(timer);
        }
    }
});
