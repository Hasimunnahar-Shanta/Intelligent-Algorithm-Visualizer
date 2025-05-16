const gridElement = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');
const speedInput = document.getElementById('speedInput');
const logContent = document.getElementById('logContent');
const algorithmSelect = document.getElementById('algorithmSelect');

const rows = 20;
const cols = 20;
let grid = [];
let startNode = null;
let endNode = null;
let isRunning = false;

// Node constructor
function Node(row, col) {
  this.row = row;
  this.col = col;
  this.isStart = false;
  this.isEnd = false;
  this.isWall = false;
  this.g = Infinity;
  this.h = 0;
  this.f = Infinity;
  this.previous = null;
  this.element = document.createElement('div');
  this.element.classList.add('cell');
  this.element.addEventListener('click', () => {
    if (isRunning) return;
    if (!startNode) {
      this.isStart = true;
      startNode = this;
      this.element.classList.add('start');
    } else if (!endNode && !this.isStart) {
      this.isEnd = true;
      endNode = this;
      this.element.classList.add('end');
    } else if (!this.isStart && !this.isEnd) {
      this.isWall = !this.isWall;
      this.element.classList.toggle('wall');
    }
  });
  gridElement.appendChild(this.element);
}

// Initialize grid
function initGrid() {
  gridElement.innerHTML = '';
  grid = [];
  startNode = null;
  endNode = null;
  isRunning = false;

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      const node = new Node(row, col);
      rowArray.push(node);
    }
    grid.push(rowArray);
  }
}

// Heuristic function (Manhattan distance)
function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Get neighbors
function getNeighbors(node) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

// A* Algorithm
async function aStar() {
  isRunning = true;
  const openSet = [];
  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current === endNode) {
      let temp = current;
      while (temp.previous) {
        temp = temp.previous;
        if (!temp.isStart) {
          temp.element.classList.add('path');
        }
      }
      logContent.innerHTML += `<p>Path found!</p>`;
      isRunning = false;
      return;
    }

    current.element.classList.add('visited');
    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      const tentativeG = current.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.previous = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }

    logContent.innerHTML += `<p>Visited node (${current.row}, ${current.col})</p>`;
    await new Promise(resolve => setTimeout(resolve, speedInput.value));
  }

  logContent.innerHTML += `<p>No path found.</p>`;
  isRunning = false;
}

// Dijkstra's Algorithm
async function dijkstra() {
  isRunning = true;
  const openSet = [];
  startNode.g = 0;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.g - b.g);
    const current = openSet.shift();

    if (current === endNode) {
      let temp = current;
      while (temp.previous) {
        temp = temp.previous;
        if (!temp.isStart) {
          temp.element.classList.add('path');
        }
      }
      logContent.innerHTML += `<p>Path found!</p>`;
      isRunning = false;
      return;
    }

    current.element.classList.add('visited');
    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      const tentativeG = current.g + 1;
      if (tentativeG < neighbor.g) {
        neighbor.previous = current;
        neighbor.g = tentativeG;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }

    logContent.innerHTML += `<p>Visited node (${current.row}, ${current.col})</p>`;
    await new Promise(resolve => setTimeout(resolve, speedInput.value));
  }

  logContent.innerHTML += `<p>No path found.</p>`;
  isRunning = false;
}

// Event listeners
startBtn.addEventListener('click', () => {
  if (startNode && endNode && !isRunning) {
    logContent.innerHTML = '';
    if (algorithmSelect.value === 'a-star') aStar();
    else dijkstra();
  }
});

clearBtn.addEventListener('click', () => {
  logContent.innerHTML = '';
  initGrid();
});

// Initialize on load
initGrid();