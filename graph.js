class Graph {
  constructor() { this.adj = new Map(); }
  clear() { this.adj.clear(); }
  addNode(u) { if (!this.adj.has(u)) this.adj.set(u, []); }
  addEdge(u, v) {
    if (this.adj.has(u) && this.adj.has(v) && u !== v) {
      this.adj.get(u).push(v);
      this.adj.get(v).push(u);
    }
  }
  neighbors(u) { return this.adj.get(u) || []; }
}

// State
const graph = new Graph();
let positions = {};
let history = [];
let intervalId;
let step = 0;

// UI refs
const graphType = document.getElementById('graph-type');
const generateBtn = document.getElementById('generate-btn');
const numNodesI = document.getElementById('num-nodes');
const numEdgesI = document.getElementById('num-edges');
const edgeInputsDiv = document.getElementById('edge-inputs');
const addEdgesBtn = document.getElementById('add-edges-btn');
const algoSelect = document.getElementById('algo-select');
const startNodeI = document.getElementById('start-node');
const speedInput = document.getElementById('speed-input');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const svg = document.getElementById('graph-canvas');
const logDiv = document.getElementById('steps-log');

// Toggle custom input fields
graphType.addEventListener('change', () => {
  const custom = graphType.value === 'custom';
  numNodesI.style.display = custom ? 'inline-block' : 'none';
  numEdgesI.style.display = custom ? 'inline-block' : 'none';
  edgeInputsDiv.style.display = 'none';
  addEdgesBtn.style.display = custom ? 'inline-block' : 'none';
  addEdgesBtn.disabled = true;
  playBtn.disabled = true;
});

// Generate Graph
generateBtn.addEventListener('click', () => {
  reset();
  graph.clear();
  drawClear();
  history = [];

  if (graphType.value === 'random') {
    const n = Math.floor(Math.random() * 6) + 5;  // 5-10 nodes
    const maxEdges = n * (n - 1) / 2;
    const m = Math.floor(Math.random() * (maxEdges - n + 1)) + n;
    for (let i = 1; i <= n; i++) graph.addNode(i.toString());
    const edges = new Set();
    while (edges.size < m) {
      const u = Math.ceil(Math.random() * n);
      const v = Math.ceil(Math.random() * n);
      if (u !== v) edges.add(`${u},${v}`);
    }
    edges.forEach(e => {
      const [u, v] = e.split(',');
      graph.addEdge(u, v);
    });
    drawGraph();
    playBtn.disabled = false;
  } else {
    const n = parseInt(numNodesI.value);
    const m = parseInt(numEdgesI.value);
    if (isNaN(n) || n < 1 || isNaN(m) || m < 0) return alert('Invalid counts');
    for (let i = 1; i <= n; i++) graph.addNode(i.toString());
    drawGraph();
    edgeInputsDiv.innerHTML = '';
    for (let i = 0; i < m; i++) {
      const uInput = document.createElement('input');
      uInput.className = 'u'; uInput.type = 'number'; uInput.placeholder = 'u'; uInput.min = '1'; uInput.max = n;
      const vInput = document.createElement('input');
      vInput.className = 'v'; vInput.type = 'number'; vInput.placeholder = 'v'; vInput.min = '1'; vInput.max = n;
      edgeInputsDiv.appendChild(uInput);
      edgeInputsDiv.appendChild(vInput);
    }
    edgeInputsDiv.style.display = 'inline-block';
    addEdgesBtn.disabled = false;
  }
});

// Add custom edges
addEdgesBtn.addEventListener('click', () => {
  const us = document.querySelectorAll('.u');
  const vs = document.querySelectorAll('.v');
  us.forEach((uEl, i) => {
    graph.addEdge(uEl.value, vs[i].value);
  });
  drawGraph();
  addEdgesBtn.disabled = true;
  playBtn.disabled = false;
});

// Draw Graph
function drawClear() { svg.innerHTML = ''; positions = {}; }
function drawGraph() {
  drawClear();
  const nodes = [...graph.adj.keys()];
  const r = 200;
  const cx = svg.clientWidth / 2;
  const cy = svg.clientHeight / 2;
  nodes.forEach((u, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    positions[u] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    svg.appendChild(el('circle', { cx: positions[u].x, cy: positions[u].y, r: 20, id: 'node' + u, class: 'node' }));
    const t = el('text', { x: positions[u].x, y: positions[u].y + 5, 'text-anchor': 'middle' });
    t.textContent = u;
    svg.appendChild(t);
  });
  const drawn = new Set();
  graph.adj.forEach((nbrs, u) => {
    nbrs.forEach(v => {
      const key = `${u},${v}`;
      if (!drawn.has(key)) {
        svg.appendChild(el('line', { x1: positions[u].x, y1: positions[u].y, x2: positions[v].x, y2: positions[v].y, id: `edge${u}_${v}`, class: 'edge' }));
        drawn.add(key);
      }
    });
  });
}
function el(tag, attrs) { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); return e; }

// Record BFS/DFS
function recordBFS(start) {
  history = [];
  const q = [start];
  const vis = new Set([start]);
  logStep(`Start BFS at ${start}`, [`node${start}`], 'visit');
  while (q.length) {
    const u = q.shift();
    logStep(`Visit ${u}`, [`node${u}`], 'visit');
    graph.neighbors(u).forEach(v => {
      if (!vis.has(v)) {
        vis.add(v);
        q.push(v);
        logStep(`Enqueue ${v}`, [`node${v}`], 'enqueue');
      }
    });
  }
}
function recordDFS(start) {
  history = [];
  const vis = new Set();
  function dfs(u) {
    vis.add(u);
    logStep(`Visit ${u}`, [`node${u}`], 'visit');
    graph.neighbors(u).forEach(v => {
      if (!vis.has(v)) {
        logStep(`Go to ${v}`, [`node${v}`], 'enqueue');
        dfs(v);
      }
    });
  }
  logStep(`Start DFS at ${start}`, [`node${start}`], 'visit');
  dfs(start);
}

// Logging & rendering
function logStep(desc, ids, cls) { history.push({ desc, ids, cls }); }
function renderLogAndGraph() {
  logDiv.innerHTML = '';
  document.querySelectorAll('.node').forEach(n => n.className.baseVal = 'node');
  for (let i = 0; i < step; i++) {
    const { desc, ids, cls } = history[i];
    const p = document.createElement('p');
    p.innerText = `${i + 1}. ${desc}`;
    logDiv.appendChild(p);
    if (i === step - 1) ids.forEach(id => document.getElementById(id)?.classList.add(cls));
  }
}

function reset() {
  clearInterval(intervalId);
  [playBtn, pauseBtn, backBtn, forwardBtn].forEach(b => b.disabled = true);
  logDiv.innerHTML = '';
  step = 0;
}

// Controls
playBtn.addEventListener('click', () => {
  const start = startNodeI.value || '1';
  if (!history.length) {
    algoSelect.value === 'bfs' ? recordBFS(start) : recordDFS(start);
  }
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  backBtn.disabled = false;
  forwardBtn.disabled = false;
  intervalId = setInterval(() => {
    if (step >= history.length) {
      clearInterval(intervalId);
    } else {
      step++;
      renderLogAndGraph();
    }
  }, parseInt(speedInput.value));
});
pauseBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  playBtn.disabled = false;
  pauseBtn.disabled = true;
});
backBtn.addEventListener('click', () => {
  if (step > 1) step--;
  renderLogAndGraph();
});
forwardBtn.addEventListener('click', () => {
  if (step < history.length) {
    step++;
    renderLogAndGraph();
  }
});