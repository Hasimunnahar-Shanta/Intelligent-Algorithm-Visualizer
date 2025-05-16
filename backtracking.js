const modeSelect = document.getElementById('mode-select');
const boardType = document.getElementById('board-type');
const boardSizeInput = document.getElementById('board-size');
const customMazeInput = document.getElementById('custom-maze-input');
const generateBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const speedInput = document.getElementById('speed-input');
const bars = document.getElementById('bars');
const stepsLog = document.getElementById('steps-log');

let board = [];
let N = 8;
let steps = [];
let intervalId = null;
let currentStep = 0;

modeSelect.addEventListener('change', updateInputVisibility);
boardType.addEventListener('change', updateInputVisibility);
generateBtn.addEventListener('click', generateBoard);
playBtn.addEventListener('click', playSteps);
pauseBtn.addEventListener('click', pauseSteps);
backBtn.addEventListener('click', backStep);
forwardBtn.addEventListener('click', forwardStep);

function updateInputVisibility() {
  if (boardType.value === 'custom') {
    boardSizeInput.style.display = 'inline';
    if (modeSelect.value === 'ratmaze') {
      customMazeInput.style.display = 'inline';
    } else {
      customMazeInput.style.display = 'none';
    }
  } else {
    boardSizeInput.style.display = 'none';
    customMazeInput.style.display = 'none';
  }
}

function generateBoard() {
  bars.innerHTML = '';
  stepsLog.innerHTML = '';
  steps = [];
  currentStep = 0;

  N = parseInt(boardSizeInput.value) || 8;

  if (modeSelect.value === 'nqueens') {
    board = Array.from({ length: N }, () => Array(N).fill(0));
    solveNQueens(0);
    drawBoard();
  } else {
    if (boardType.value === 'custom') {
      const rows = customMazeInput.value.trim().split(',');
      board = rows.map(row => row.trim().split('').map(Number));
      N = board.length;
    } else {
      board = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => (Math.random() < 0.2 ? 1 : 0))
      );
      board[0][0] = board[N-1][N-1] = 0; // Start and End must be free
    }
    solveRatMaze(0, 0);
    drawBoard();
  }
}

function drawBoard() {
  bars.style.gridTemplateColumns = `repeat(${N}, 40px)`;
  bars.innerHTML = '';
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (modeSelect.value === 'nqueens') {
        if (board[i][j] === 1) cell.classList.add('queen');
      } else {
        if (board[i][j] === 1) cell.classList.add('wall');
      }
      bars.appendChild(cell);
    }
  }
}

function updateBoard(step) {
  const cells = document.querySelectorAll('.cell');
  if (modeSelect.value === 'nqueens') {
    cells.forEach((cell, index) => {
      const x = Math.floor(index / N);
      const y = index % N;
      cell.className = 'cell';
      if (step.board[x][y] === 1) cell.classList.add('queen');
    });
  } else {
    cells.forEach((cell, index) => {
      const x = Math.floor(index / N);
      const y = index % N;
      cell.className = 'cell';
      if (board[x][y] === 1) cell.classList.add('wall');
      else if (step.visited.some(([i, j]) => i === x && j === y)) {
        cell.classList.add('visited');
      }
      if (x === N-1 && y === N-1) {
        cell.classList.add('path');
      }
    });
  }
}

function playSteps() {
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  backBtn.disabled = true;
  forwardBtn.disabled = true;

  intervalId = setInterval(() => {
    if (currentStep >= steps.length) {
      pauseSteps();
      return;
    }
    updateBoard(steps[currentStep]);
    logStep(steps[currentStep]);
    currentStep++;
  }, parseInt(speedInput.value));
}

function pauseSteps() {
  clearInterval(intervalId);
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  backBtn.disabled = false;
  forwardBtn.disabled = false;
}

function backStep() {
  if (currentStep > 0) {
    currentStep--;
    updateBoard(steps[currentStep]);
  }
}

function forwardStep() {
  if (currentStep < steps.length) {
    updateBoard(steps[currentStep]);
    currentStep++;
  }
}

function logStep(step) {
  const p = document.createElement('p');
  p.textContent = step.desc;
  stepsLog.appendChild(p);
  stepsLog.scrollTop = stepsLog.scrollHeight;
}

/* Algorithm: N-Queens */
function solveNQueens(row) {
  if (row === N) {
    steps.push({ board: JSON.parse(JSON.stringify(board)), desc: `Placed all queens.` });
    return true;
  }
  for (let col = 0; col < N; col++) {
    if (isSafe(row, col)) {
      board[row][col] = 1;
      steps.push({ board: JSON.parse(JSON.stringify(board)), desc: `Placed queen at (${row}, ${col}).` });
      if (solveNQueens(row + 1)) return true;
      board[row][col] = 0;
      steps.push({ board: JSON.parse(JSON.stringify(board)), desc: `Backtracked from (${row}, ${col}).` });
    }
  }
  return false;
}

function isSafe(row, col) {
  for (let i = 0; i < row; i++) if (board[i][col]) return false;
  for (let i = row-1, j = col-1; i>=0 && j>=0; i--, j--) if (board[i][j]) return false;
  for (let i = row-1, j = col+1; i>=0 && j<N; i--, j++) if (board[i][j]) return false;
  return true;
}

/* Algorithm: Rat in a Maze */
function solveRatMaze(x, y, visited = []) {
  if (x < 0 || y < 0 || x >= N || y >= N || board[x][y] === 1) return false;
  visited.push([x, y]);
  steps.push({ visited: [...visited], desc: `Moved to (${x}, ${y}).` });
  if (x === N-1 && y === N-1) return true;

  if (solveRatMaze(x + 1, y, visited)) return true;
  if (solveRatMaze(x, y + 1, visited)) return true;
  if (solveRatMaze(x - 1, y, visited)) return true;
  if (solveRatMaze(x, y - 1, visited)) return true;

  visited.pop();
  steps.push({ visited: [...visited], desc: `Backtracked from (${x}, ${y}).` });
  return false;
}
