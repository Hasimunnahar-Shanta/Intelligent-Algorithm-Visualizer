// DOM Elements
const graphTypeSelect = document.getElementById("graph-type");
const nodeCountInput = document.getElementById("node-count");
const edgeCountInput = document.getElementById("edge-count");
const colorCountInput = document.getElementById("color-count");
const speedInput = document.getElementById("speed-input");
const generateBtn = document.getElementById("generate-btn");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const backBtn = document.getElementById("back-btn");
const forwardBtn = document.getElementById("forward-btn");
const graphContainer = document.getElementById("graph-container");
const stepsLog = document.getElementById("steps-log");

// State Variables
let nodes = [];
let edges = [];
let steps = [];
let currentStep = 0;
let interval = null;
let speed = 500;
let colorCount = 3;
const colorPalette = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"
];

// Event Listeners
graphTypeSelect.addEventListener("change", () => {
  const isCustom = graphTypeSelect.value === "custom";
  nodeCountInput.style.display = isCustom ? "inline-block" : "none";
  edgeCountInput.style.display = isCustom ? "inline-block" : "none";
  colorCountInput.style.display = isCustom ? "inline-block" : "none";
});

generateBtn.addEventListener("click", () => {
  clearInterval(interval);
  currentStep = 0;
  steps = [];
  stepsLog.innerHTML = "";
  graphContainer.innerHTML = "";
  nodes = [];
  edges = [];

  const type = graphTypeSelect.value;
  speed = parseInt(speedInput.value) || 500;

  if (type === "random") {
    const nodeCount = 6;
    const edgeCount = 8;
    colorCount = 3;
    generateRandomGraph(nodeCount, edgeCount);
  } else {
    const nodeCount = parseInt(nodeCountInput.value);
    const edgeCount = parseInt(edgeCountInput.value);
    colorCount = parseInt(colorCountInput.value);
    if (isNaN(nodeCount) || isNaN(edgeCount) || isNaN(colorCount)) {
      alert("Please enter valid numbers for nodes, edges, and colors.");
      return;
    }
    generateRandomGraph(nodeCount, edgeCount);
  }

  playBtn.disabled = false;
  pauseBtn.disabled = true;
  backBtn.disabled = false;
  forwardBtn.disabled = false;
});

playBtn.addEventListener("click", () => {
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  interval = setInterval(() => {
    if (currentStep < steps.length) {
      applyStep(currentStep);
      currentStep++;
    } else {
      clearInterval(interval);
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      displayFinalResult();
    }
  }, speed);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(interval);
  playBtn.disabled = false;
  pauseBtn.disabled = true;
});

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    resetGraph();
    for (let i = 0; i < currentStep; i++) {
      applyStep(i);
    }
  }
});

forwardBtn.addEventListener("click", () => {
  if (currentStep < steps.length) {
    applyStep(currentStep);
    currentStep++;
    if (currentStep === steps.length) {
      displayFinalResult();
    }
  }
});

// Functions
function generateRandomGraph(nodeCount, edgeCount) {
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement("div");
    node.classList.add("node");
    node.textContent = i;
    const angle = (2 * Math.PI * i) / nodeCount;
    const radius = 150;
    const centerX = graphContainer.clientWidth / 2;
    const centerY = graphContainer.clientHeight / 2;
    const x = centerX + radius * Math.cos(angle) - 20;
    const y = centerY + radius * Math.sin(angle) - 20;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    graphContainer.appendChild(node);
    nodes.push({ element: node, x: x + 20, y: y + 20, color: null });
  }

  // Create edges
  const edgeSet = new Set();
  while (edges.length < edgeCount) {
    const a = Math.floor(Math.random() * nodeCount);
    const b = Math.floor(Math.random() * nodeCount);
    if (a !== b && !edgeSet.has(`${a}-${b}`) && !edgeSet.has(`${b}-${a}`)) {
      edgeSet.add(`${a}-${b}`);
      const edge = document.createElement("div");
      edge.classList.add("edge");
      const x1 = nodes[a].x;
      const y1 = nodes[a].y;
      const x2 = nodes[b].x;
      const y2 = nodes[b].y;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      edge.style.width = `${length}px`;
      edge.style.left = `${x1}px`;
      edge.style.top = `${y1}px`;
      edge.style.transform = `rotate(${angle}deg)`;
      graphContainer.appendChild(edge);
      edges.push({ from: a, to: b });
    }
  }

  // Build adjacency list
  const adjacency = Array.from({ length: nodeCount }, () => []);
  edges.forEach(({ from, to }) => {
    adjacency[from].push(to);
    adjacency[to].push(from);
  });

  // Greedy coloring algorithm
  const nodeColors = Array(nodeCount).fill(null);
  for (let i = 0; i < nodeCount; i++) {
    const usedColors = new Set();
    adjacency[i].forEach((neighbor) => {
      if (nodeColors[neighbor] !== null) {
        usedColors.add(nodeColors[neighbor]);
      }
    });
    let color = 0;
    while (usedColors.has(color)) {
      color++;
    }
    if (color >= colorCount) {
      steps.push({
        node: i,
        color: null,
        log: `Step ${steps.length + 1}: Cannot assign a color to node ${i} as all ${colorCount} colors are used by adjacent nodes.`
      });
    } else {
      nodeColors[i] = color;
      steps.push({
        node: i,
        color: color,
        log: `Step ${steps.length + 1}: Assigned color ${color} to node ${i}.`
      });
    }
  }
}

function applyStep(index) {
  const step = steps[index];
  const node = nodes[step.node];
  if (step.color !== null) {
    node.color = step.color;
    node.element.style.backgroundColor = colorPalette[step.color % colorPalette.length];
  } else {
    node.element.style.backgroundColor = "#000";
  }
  const logEntry = document.createElement("p");
  logEntry.textContent = step.log;
  stepsLog.appendChild(logEntry);
  stepsLog.scrollTop = stepsLog.scrollHeight;
}

function resetGraph() {
  nodes.forEach((node) => {
    node.color = null;
    node.element.style.backgroundColor = "#ccc";
  });
  stepsLog.innerHTML = "";
}

function displayFinalResult() {
  const success = steps.every(step => step.color !== null);
  const finalLog = document.createElement("p");
  finalLog.textContent = success
    ? `Graph successfully colored using ${colorCount} colors.`
    : `Graph could not be colored with ${colorCount} colors.`;
  finalLog.style.fontWeight = "bold";
  stepsLog.appendChild(finalLog);
  stepsLog.scrollTop = stepsLog.scrollHeight;
}
