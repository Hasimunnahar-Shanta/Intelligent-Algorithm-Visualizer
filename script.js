document.addEventListener('DOMContentLoaded', function() {
    const fetchBtn = document.getElementById('fetchBtn');
    const recBtn = document.getElementById('recBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const platform = document.getElementById('platform');
    const pid = document.getElementById('problemId');
    const titleEl = document.getElementById('probTitle');
    const descEl = document.getElementById('probDesc');
    const recSection = document.querySelector('.recommend-section');
    const resultSection = document.querySelector('.result-section');
    const algoEl = document.getElementById('algo');
    const timeEl = document.getElementById('timeC');
    const spaceEl = document.getElementById('spaceC');
  
    fetchBtn.addEventListener('click', async () => {
      fetchBtn.disabled = true;
      fetchBtn.textContent = 'Fetching...';
      const res = await fetch('/fetch', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({platform: platform.value, pid: pid.value})
      });
      const data = await res.json();
      fetchBtn.disabled = false;
      fetchBtn.textContent = 'Fetch Problem';
      if (data.error) { alert(data.error); return; }
      titleEl.textContent = data.title;
      descEl.value = data.description;
      recSection.style.display = 'block';
    });
  
    recBtn.addEventListener('click', async () => {
      recBtn.disabled = true;
      recBtn.textContent = 'Analyzing...';
      const res = await fetch('/recommend', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({description: descEl.value})
      });
      const data = await res.json();
      recBtn.disabled = false;
      recBtn.textContent = 'Recommend Algorithm';
      if (data.algorithm) {
        algoEl.textContent = data.algorithm;
        timeEl.textContent = data.time_complexity;
        spaceEl.textContent = data.space_complexity;
        resultSection.style.display = 'block';
      } else { alert('Recommendation failed'); }
    });
  
    downloadBtn.addEventListener('click', async () => {
      const payload = {
        title: titleEl.textContent,
        description: descEl.value,
        algorithm: algoEl.textContent,
        time_complexity: timeEl.textContent,
        space_complexity: spaceEl.textContent
      };
      const res = await fetch('/download_pdf', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recommendation.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  });