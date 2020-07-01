// Create the 200 square grid
const grid = document.querySelector(".grid");
const all200divs = document.createDocumentFragment();
for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    all200divs.appendChild(div);
}
grid.appendChild(all200divs);

// Create a row with class "frozen", after the main grid to freeze the tetrimino pieces which reach the end
const all10divs = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
    const div = document.createElement("div");
    div.classList.add("frozen");
    all10divs.appendChild(div);
}
grid.appendChild(all10divs);

// Create the mini-grid to display next tetrimino
const miniGrid = document.querySelector(".mini-grid");
const all16divs = document.createDocumentFragment();
for (let i = 0; i < 16; i++) {
    const div = document.createElement("div");
    all16divs.appendChild(div);
}
miniGrid.appendChild(all16divs);

const width = 10;
let allSquares = Array.from(document.querySelectorAll(".grid div"));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-btn");
let nextRandomTetrimino = 0;
let timerId = 0;
let score = 0;

// All rotations of all tetris shapes, also called as a tetrimino
const jTetrimino = [
    [1, width + 1, width * 2 + 1, 2],
    [0, 1, 2, width * 1 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width * 1, width * 1 + 1, width * 1 + 2],
];

const lTetrimino = [
    [0, 1, 2, width * 1],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
];

const tTetrimino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [0, 1, 2, width * 1 + 1],
    [1, width, width + 1, width * 2 + 1],
];

const sTetrimino = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
];

const zTetrimino = [
    [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
];

const iTetrimino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3],
];

const oTetrimino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];

// An array of all all shapes
const allTetriminoes = [
    jTetrimino,
    lTetrimino,
    tTetrimino,
    sTetrimino,
    zTetrimino,
    iTetrimino,
    oTetrimino,
];

//Set current position
let currentPos = 4;
// Set random rotation for any given tetrimino shape
let currentRotation = 0;

// Select a random type of tetrimino's random rotation
let randomTetrimino = Math.floor(Math.random() * allTetriminoes.length);
let currentTetrimino = allTetriminoes[randomTetrimino][currentRotation];

// Draw the tetrimino
function draw() {
    currentTetrimino.forEach((index) =>
        allSquares[currentPos + index].classList.add("tetrimino")
    );
}

// Clear the tetrimino
function undraw() {
    currentTetrimino.forEach((index) => {
        allSquares[currentPos + index].classList.remove("tetrimino");
    });
}

// // Make the tetrimino move down;
// timerId = setInterval(moveDown, 1000);

// Assign keystroke events for moving the tetriminoes
function control(event) {
    if (event.keyCode === 37) {
        moveLeft();
    } else if (event.keyCode === 38) {
        rotateTetrimino();
    } else if (event.keyCode === 39) {
        moveRight();
    } else if (event.keyCode === 40) {
        moveDown();
    }
}

document.addEventListener("keydown", control);

// freeze if piece reaches the last row of the grid
function freeze() {
    if (
        currentTetrimino.some((index) =>
            allSquares[currentPos + index + width].classList.contains("frozen")
        )
    ) {
        currentTetrimino.forEach((index) =>
            allSquares[currentPos + index].classList.add("frozen")
        );

        // Start a new tetrimino piece
        randomTetrimino = nextRandomTetrimino;
        currentTetrimino = allTetriminoes[randomTetrimino][currentRotation];
        nextRandomTetrimino = Math.floor(Math.random() * allTetriminoes.length);
        currentPos = 4;
        draw();
        displayNext();
        addScore();
        gameOver();
    }
}

// Move the tetrimino down
function moveDown() {
    undraw();
    currentPos += width;
    draw();
    freeze();
}

// Move left, unless tetrimino is at the edge of the grid
function moveLeft() {
    undraw();
    const isLeftEdge = currentTetrimino.some(
        (index) => !((currentPos + index) % width)
    );

    if (!isLeftEdge) {
        currentPos--;
    }

    if (
        currentTetrimino.some((index) =>
            allSquares[currentPos + index].classList.contains("frozen")
        )
    ) {
        currentPos++;
    }
    draw();
}

// Move right, unless tetrimino is at the edge of the grid
function moveRight() {
    undraw();
    const isRightEdge = currentTetrimino.some(
        (index) => (currentPos + index) % width === width - 1
    );

    if (!isRightEdge) {
        currentPos++;
    }

    if (
        currentTetrimino.some((index) =>
            allSquares[currentPos + index].classList.contains("frozen")
        )
    ) {
        currentPos--;
    }
    draw();
}

// Rotate the tetrimino
function rotateTetrimino() {
    undraw();
    const temp = currentRotation;

    currentRotation++;
    if (currentRotation === currentTetrimino.length) {
        currentRotation = 0;
    }
    currentTetrimino = allTetriminoes[randomTetrimino][currentRotation];

    // Check if rotation is possible at the edges
    const isRightEdge = currentTetrimino.some(
        (index) => (currentPos + index) % width === width - 1
    );
    const isLeftEdge = currentTetrimino.some(
        (index) => !((currentPos + index) % width)
    );

    if (isLeftEdge || isRightEdge) {
        currentRotation = temp;
        currentTetrimino = allTetriminoes[randomTetrimino][currentRotation];
    }
    draw();
}

// Displaying the next tetrimino
const displaySquares = Array.from(document.querySelectorAll(".mini-grid div"));
const displayWidth = 4;

// All tetriminoes' first rotations
const upNextTetriminoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, 1, 2, displayWidth * 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [1, 2, displayWidth, displayWidth + 1],
    [0, 1, displayWidth + 1, displayWidth + 2],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
    [0, 1, displayWidth, displayWidth + 1],
];

// fn to display the next tetrimino
function displayNext() {
    // remove class "tetrimino" from the whole mini grid
    displaySquares.forEach((square) => {
        square.classList.remove("tetrimino");
    });

    upNextTetriminoes[nextRandomTetrimino].forEach((index) => {
        displaySquares[index].classList.add("tetrimino");
    });
}

// Add functionality to the Start/Pause button
startBtn.addEventListener("click", () => {
    // If pause functionality is needed
    if (timerId) {
        startBtn.innerHTML = "Resume Game";
        clearInterval(timerId);
        timerId = null;
    }
    // When the game needs to be started
    else {
        startBtn.innerHTML = "Pause Game";
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandomTetrimino = Math.floor(Math.random() * allTetriminoes.length);
        displayNext();
    }
});

// Add Score functionality
function addScore() {
    for (let i = 0; i < 200; i += width) {
        const row = [
            i,
            i + 1,
            i + 2,
            i + 3,
            i + 4,
            i + 5,
            i + 6,
            i + 7,
            i + 8,
            i + 9,
        ];

        if (
            row.every((index) => allSquares[index].classList.contains("frozen"))
        ) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach((index) => {
                allSquares[index].classList.remove("frozen");
                allSquares[index].classList.remove("tetrimino");
            });
            const removedRow = allSquares.splice(i, width);
            console.log(removedRow);
            allSquares = removedRow.concat(allSquares);
            allSquares.forEach((cell) => grid.appendChild(cell));
        }
    }
}

// fn to indicate GAME OVER
function gameOver() {
    if (
        currentTetrimino.some((index) =>
            allSquares[currentPos + index].classList.contains("frozen")
        )
    ) {
        scoreDisplay.innerHTML = `Game over, you had scored ${score} points!`;
        startBtn.innerHTML = "Restart Game";
        clearInterval(timerId);
    }

    // Restart game when user clicks the button
    if (startBtn.innerHTML === "Restart Game") {
        startBtn.addEventListener("click", () => window.location.reload());
    }
}
