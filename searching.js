// State
let array = [];
let target = null;
let history = [];
let currentStep = 0;
let playInterval = null;

// UI Elements
const arrayType = document.getElementById('array-type');
const customSize = document.getElementById('custom-size');
const customInput = document.getElementById('custom-array-input');
const speedInput = document.getElementById('speed-input');
const genBtn = document.getElementById('generate-btn');
const targetInput = document.getElementById('target-input');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const barsContainer = document.getElementById('bars');
const stepsLog = document.getElementById('steps-log');
const algoSelect = document.getElementById('algo-select');

// Show/hide custom input
arrayType.addEventListener('change', () => {
  const show = arrayType.value === 'custom';
  customSize.style.display = show ? 'inline-block' : 'none';
  customInput.style.display = show ? 'inline-block' : 'none';
});

// Generate array
genBtn.addEventListener('click', () => {
  if (arrayType.value === 'custom') {
    const size = parseInt(customSize.value);
    const vals = customInput.value.split(',').map(n => parseInt(n.trim()));
    if (isNaN(size) || vals.length !== size || vals.some(isNaN)) {
      return alert('Invalid custom array.');
    }
    array = vals;
  } else {
    array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 250) + 20);
  }
  renderBars(array);
  reset();
  playBtn.disabled = false;
});

// Helpers
const getSearchType = () => algoSelect.value;
// Render bars with new UI
const renderBars = (heights, colors = []) => {
  barsContainer.innerHTML = '';
  const maxVal = Math.max(...heights, 100); // Ensure we have a minimum height reference

  heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(h / maxVal) * 100}%`;
    bar.style.width = `${100 / heights.length - 1}%`;
    bar.style.background = colors[i] || 'linear-gradient(to top, #1a2a6c, #b21f1f, #fdbb2d)';
    bar.style.borderRadius = '8px';

    const label = document.createElement('span');
    label.innerText = h;
    bar.appendChild(label);

    barsContainer.appendChild(bar);
  });
};


function reset() {
  clearInterval(playInterval);
  history = [];
  currentStep = 0;
  stepsLog.innerHTML = '';
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  backBtn.disabled = true;
  forwardBtn.disabled = true;
}

// Record steps for search
function record() {
  const arr = array.slice();
  target = parseInt(targetInput.value);
  if (isNaN(target)) return alert('Please enter a valid target number.');
  const type = getSearchType();
  let left = 0, right = arr.length - 1;

  history.push({ heights: arr.slice(), colors: Array(arr.length).fill(null), desc: '🔍 Starting search...' });

  if (type === 'linear') {
    for (let i = 0; i < arr.length; i++) {
      history.push({
        heights: arr.slice(),
        colors: Array(arr.length).fill('#e0e0e0').map((c, idx) => idx === i ? '#f39c12' : c),
        desc: `🔎 Checking index ${i} — value ${arr[i]}`
      });
      if (arr[i] === target) {
        history.push({
          heights: arr.slice(),
          colors: Array(arr.length).fill('#95a5a6').map((c, idx) => idx === i ? '#27ae60' : c),
          desc: `✅ Found target ${target} at index ${i}`
        });
        return;
      }
    }
    history.push({ heights: arr.slice(), colors: Array(arr.length).fill('#e74c3c'), desc: '❌ Target not found.' });
  } else {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      history.push({
        heights: arr.slice(),
        colors: Array(arr.length).fill('#dcdcdc').map((c, idx) => idx === mid ? '#f39c12' : c),
        desc: `🔍 Checking mid index ${mid} — value ${arr[mid]}`
      });
      if (arr[mid] === target) {
        history.push({
          heights: arr.slice(),
          colors: Array(arr.length).fill('#bdc3c7').map((c, idx) => idx === mid ? '#27ae60' : c),
          desc: `✅ Found target ${target} at index ${mid}`
        });
        return;
      }
      if (arr[mid] < target) {
        left = mid + 1;
        history.push({
          heights: arr.slice(),
          colors: Array(arr.length).fill('#3498db'),
          desc: `↘️ Value ${arr[mid]} < ${target}, moving right`
        });
      } else {
        right = mid - 1;
        history.push({
          heights: arr.slice(),
          colors: Array(arr.length).fill('#3498db'),
          desc: `↙️ Value ${arr[mid]} > ${target}, moving left`
        });
      }
    }
    history.push({ heights: arr.slice(), colors: Array(arr.length).fill('#e74c3c'), desc: '❌ Target not found.' });
  }
}

// Play animation
function playAnimation() {
  if (!history.length) record();
  playBtn.disabled = true;
  pauseBtn.disabled = false;
  backBtn.disabled = false;
  forwardBtn.disabled = false;
  stepsLog.innerHTML = '';

  playInterval = setInterval(() => {
    if (currentStep >= history.length) {
      clearInterval(playInterval);
      return;
    }
    const step = history[currentStep++];
    renderBars(step.heights, step.colors);
    const p = document.createElement('p');
    p.className = 'text-sm text-gray-800 mb-1';
    p.innerText = `${currentStep}. ${step.desc}`;
    stepsLog.appendChild(p);
    stepsLog.scrollTop = stepsLog.scrollHeight;
  }, parseInt(speedInput.value));
}

// Pause animation
function pauseAnimation() {
  clearInterval(playInterval);
  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Step backward
function stepBackward() {
  if (currentStep <= 1) return;
  currentStep--;
  const step = history[currentStep - 1];
  renderBars(step.heights, step.colors);
  rebuildLog();
}

// Step forward
function stepForward() {
  if (currentStep >= history.length) return;
  const step = history[currentStep++];
  renderBars(step.heights, step.colors);
  rebuildLog();
}

// Rebuild step logs
function rebuildLog() {
  stepsLog.innerHTML = '';
  for (let i = 0; i < currentStep; i++) {
    const p = document.createElement('p');
    p.className = 'text-sm text-gray-700';
    p.innerText = `${i + 1}. ${history[i].desc}`;
    stepsLog.appendChild(p);
  }
  stepsLog.scrollTop = stepsLog.scrollHeight;
}

// Event bindings
playBtn.addEventListener('click', playAnimation);
pauseBtn.addEventListener('click', pauseAnimation);
backBtn.addEventListener('click', stepBackward);
forwardBtn.addEventListener('click', stepForward);

// On load
window.onload = () => {
  renderBars([]);
};
