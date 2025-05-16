// ==== STATE ====
let array = [];
let history = [];
let currentStep = 0;
let playInterval = null;

// ==== UI ELEMENTS ====
const arrayType = document.getElementById('array-type');
const customSize = document.getElementById('custom-size');
const customInput = document.getElementById('custom-array-input');
const orderType = document.getElementById('order-type');
const speedInput = document.getElementById('speed-input');
const genBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const barsContainer = document.getElementById('bars');
const stepsLog = document.getElementById('steps-log');
const algoSelect = document.getElementById('algo-select');

// ==== EVENT: Toggle Custom Array Input ====
arrayType.addEventListener('change', () => {
    const show = arrayType.value === 'custom';
    customSize.style.display = show ? 'inline-block' : 'none';
    customInput.style.display = show ? 'inline-block' : 'none';
});

// ==== EVENT: Generate Array ====
genBtn.addEventListener('click', () => {
    if (arrayType.value === 'custom') {
        const size = parseInt(customSize.value);
        const vals = customInput.value.split(',').map(n => parseInt(n.trim()));
        if (isNaN(size) || vals.length !== size || vals.some(isNaN)) {
            alert('Invalid custom array.');
            return;
        }
        array = vals;
    } else {
        array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 250) + 20);
    }
    renderBars(array);
    reset();
    playBtn.disabled = false;
});

// ==== HELPERS ====
const getSearchType = () => algoSelect.value;

const renderBars = (heights, colors = []) => {
    barsContainer.innerHTML = '';
    const maxVal = Math.max(...heights, 100);
    heights.forEach((height, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(height / maxVal) * 100}%`;
        bar.style.width = `${100 / heights.length - 1}%`;
        bar.style.background = colors[index] || 'linear-gradient(to top, #1a2a6c, #b21f1f, #fdbb2d)';
        bar.style.borderRadius = '8px';
        bar.style.display = 'flex';
        bar.style.alignItems = 'flex-end';
        bar.style.justifyContent = 'center';
        bar.style.margin = '0 0.5px';

        const label = document.createElement('span');
        label.innerText = height;
        label.style.fontSize = '10px';
        label.style.color = '#fff';
        label.style.paddingBottom = '2px';

        bar.appendChild(label);
        barsContainer.appendChild(bar);
    });
};

const reset = () => {
    clearInterval(playInterval);
    history = [];
    currentStep = 0;
    stepsLog.innerHTML = '';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    backBtn.disabled = true;
    forwardBtn.disabled = true;
};

// ==== RECORD SORTING STEPS ====
const record = () => {
    const arr = [...array];
    const asc = orderType.value === 'asc';
    const cmp = (a, b) => asc ? a < b : a > b;
    const algo = getSearchType();

    const logStep = (i, j, swapped = false) => {
        const colors = Array(arr.length).fill('#ccc');
        colors[i] = colors[j] = swapped ? '#e74c3c' : '#f1c40f';
        const desc = swapped
            ? `Swapped index ${i} (value ${arr[j]}) and ${j} (value ${arr[i]})`
            : `Compared index ${i} (value ${arr[i]}) and ${j} (value ${arr[j]})`;
        history.push({ arr: [...arr], colors, desc });
    };

    history.push({ arr: [...arr], colors: Array(arr.length).fill(null), desc: 'Initial array' });

    // Bubble Sort
    if (algo === 'bubble') {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - 1 - i; j++) {
                logStep(j, j + 1);
                if (!cmp(arr[j], arr[j + 1])) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    logStep(j, j + 1, true);
                }
            }
        }
    }

    // Selection Sort
    else if (algo === 'selection') {
        for (let i = 0; i < arr.length; i++) {
            let idx = i;
            for (let j = i + 1; j < arr.length; j++) {
                logStep(idx, j);
                if (cmp(arr[j], arr[idx])) idx = j;
            }
            if (idx !== i) {
                [arr[i], arr[idx]] = [arr[idx], arr[i]];
                logStep(i, idx, true);
            }
        }
    }

    // Insertion Sort
    else if (algo === 'insertion') {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i], j = i - 1;
            while (j >= 0 && !cmp(arr[j], key)) {
                logStep(j, j + 1);
                arr[j + 1] = arr[j];
                logStep(j, j + 1, true);
                j--;
            }
            arr[j + 1] = key;
            history.push({ arr: [...arr], colors: Array(arr.length).fill('#2ecc71'), desc: `Inserted value ${key} at position ${j + 1}` });
        }
    }

    // Merge Sort
    else if (algo === 'merge') {
        const merge = (l, m, r) => {
            const L = arr.slice(l, m + 1);
            const R = arr.slice(m + 1, r + 1);
            let i = 0, j = 0, k = l;
            while (i < L.length && j < R.length) {
                logStep(l + i, m + 1 + j);
                arr[k++] = cmp(L[i], R[j]) ? L[i++] : R[j++];
                history.push({ arr: [...arr], colors: Array(arr.length).fill('#2ecc71'), desc: `Merged at index ${k - 1}` });
            }
            while (i < L.length) {
                arr[k++] = L[i++];
                history.push({ arr: [...arr], colors: Array(arr.length).fill('#2ecc71'), desc: `Merged leftover L at index ${k - 1}` });
            }
            while (j < R.length) {
                arr[k++] = R[j++];
                history.push({ arr: [...arr], colors: Array(arr.length).fill('#2ecc71'), desc: `Merged leftover R at index ${k - 1}` });
            }
        };
        const mergeSort = (l, r) => {
            if (l < r) {
                const m = Math.floor((l + r) / 2);
                mergeSort(l, m);
                mergeSort(m + 1, r);
                merge(l, m, r);
            }
        };
        mergeSort(0, arr.length - 1);
    }

    // Quick Sort
    else if (algo === 'quick') {
        const quickSort = (l, r) => {
            if (l < r) {
                let pi = l;
                const pivot = arr[r];
                for (let j = l; j < r; j++) {
                    logStep(j, r);
                    if (cmp(arr[j], pivot)) {
                        [arr[pi], arr[j]] = [arr[j], arr[pi]];
                        logStep(pi, j, true);
                        pi++;
                    }
                }
                [arr[pi], arr[r]] = [arr[r], arr[pi]];
                logStep(pi, r, true);
                quickSort(l, pi - 1);
                quickSort(pi + 1, r);
            }
        };
        quickSort(0, arr.length - 1);
    }
};

// ==== PLAY/PAUSE CONTROL ====
const playAnimation = () => {
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
        renderBars(step.arr, step.colors);
        const p = document.createElement('p');
        p.innerText = `${currentStep}. ${step.desc}`;
        stepsLog.appendChild(p);
    }, parseInt(speedInput.value));
};

const pauseAnimation = () => {
    clearInterval(playInterval);
    playBtn.disabled = false;
    pauseBtn.disabled = true;
};

const stepBackward = () => {
    if (currentStep <= 1) return;
    currentStep--;
    renderBars(history[currentStep - 1].arr, history[currentStep - 1].colors);
    rebuildLog();
};

const stepForward = () => {
    if (currentStep >= history.length) return;
    renderBars(history[currentStep].arr, history[currentStep].colors);
    currentStep++;
    rebuildLog();
};

const rebuildLog = () => {
    stepsLog.innerHTML = '';
    for (let i = 0; i < currentStep; i++) {
        const p = document.createElement('p');
        p.innerText = `${i + 1}. ${history[i].desc}`;
        stepsLog.appendChild(p);
    }
};

// ==== CONTROL EVENT BINDINGS ====
playBtn.addEventListener('click', playAnimation);
pauseBtn.addEventListener('click', pauseAnimation);
backBtn.addEventListener('click', stepBackward);
forwardBtn.addEventListener('click', stepForward);

// ==== INITIAL RENDER ====
window.onload = () => renderBars([]);
