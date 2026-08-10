const $ = (sel) => document.querySelector(sel);

const state = {
  latest: null,
  history: [],
};

function fmtDate(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtDuration(ms) {
  if (!ms && ms !== 0) return '–';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function statusLabel(status) {
  const map = {
    passed: 'עברו',
    failed: 'נכשלו',
    timedout: 'Timed out',
    timedOut: 'Timed out',
    interrupted: 'נקטעו',
    running: 'רצים…',
    skipped: 'דילגו',
  };
  return map[status] || status;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function loadData() {
  const [latest, history] = await Promise.all([
    loadJSON('dashboard-data/latest.json'),
    loadJSON('dashboard-data/history.json'),
  ]);
  state.latest = latest;
  state.history = Array.isArray(history) ? history : [];
  renderAll();
}

function renderAll() {
  renderLatest(state.latest);
  renderAllTime(state.history);
  renderTrend(state.history);
  populateProjectFilter(state.history);
  renderRuns();
  renderTests();
}

function renderLatest(latest) {
  if (!latest) {
    $('#latestMeta').textContent = 'אין נתונים עדיין. הריצה הראשונה ב-GitHub תמלא את הדשבורד.';
    return;
  }
  $('#latestTotal').textContent = latest.total;
  $('#latestPassed').textContent = latest.passed;
  $('#latestFailed').textContent = latest.failed;
  $('#latestFlaky').textContent = latest.flaky;
  $('#latestSkipped').textContent = latest.skipped;
  $('#latestRate').textContent = latest.total ? `${Math.round((latest.passed * 100) / latest.total)}%` : '–';
  $('#latestMeta').textContent = `פרויקט: ${latest.project} · תאריך: ${fmtDate(latest.startedAt)} · משך: ${fmtDuration(latest.durationMs)}`;
}

function renderAllTime(history) {
  if (!history.length) return;
  let total = 0, passed = 0, failed = 0, flaky = 0;
  for (const r of history) {
    total += r.total || 0;
    passed += r.passed || 0;
    failed += r.failed || 0;
    flaky += r.flaky || 0;
  }
  $('#allRuns').textContent = history.length;
  $('#allTotal').textContent = total;
  $('#allPassed').textContent = passed;
  $('#allFailed').textContent = failed;
  $('#allFlaky').textContent = flaky;
  $('#allRate').textContent = total ? `${Math.round((passed * 100) / total)}%` : '–';
}

function renderTrend(history) {
  const el = $('#trendChart');
  if (!history.length) {
    el.innerHTML = '<div class="empty">אין מספיק נתונים לגרף עדיין</div>';
    return;
  }

  const W = 1000, H = 260, padL = 40, padR = 16, padT = 20, padB = 30;
  const maxVal = Math.max(1, ...history.map((r) => r.total || 0));
  const n = history.length;
  const bw = Math.max(14, Math.min(46, (W - padL - padR) / n - 6));
  const step = (W - padL - padR) / n;
  const x = (i) => padL + step * i + (step - bw) / 2;
  const y = (v) => padT + (H - padT - padB) * (1 - v / maxVal);

  let bars = '';
  let labels = '';
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => `<line x1="${padL}" y1="${y(maxVal * f)}" x2="${W - padR}" y2="${y(maxVal * f)}" stroke="#eef2f7" stroke-width="1"/>`)
    .join('');

  history.forEach((r, i) => {
    const cx = x(i);
    const hPass = (r.passed || 0) / maxVal * (H - padT - padB);
    const hFail = (r.failed || 0) / maxVal * (H - padT - padB);
    const base = H - padB;
    const yFail = base - hPass;
    const yOther = yFail - hFail;
    bars += `<rect x="${cx}" y="${yFail}" width="${bw}" height="${Math.max(0, hPass)}" fill="#16a34a" opacity="0.85"/>`;
    bars += `<rect x="${cx}" y="${yOther}" width="${bw}" height="${Math.max(0, hFail)}" fill="#dc2626" opacity="0.85"/>`;
    labels += `<text x="${cx + bw / 2}" y="${H - 8}" font-size="10" fill="#9ca3af" text-anchor="middle">${fmtDate(r.startedAt).slice(0, 5)}</text>`;
  });

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}">
      ${grid}${bars}${labels}
    </svg>`;
}

function populateProjectFilter(history) {
  const sel = $('#runProjectFilter');
  const projects = new Set(history.map((r) => r.project).filter(Boolean));
  for (const p of projects) {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    sel.appendChild(opt);
  }
}

function filteredRuns() {
  const project = $('#runProjectFilter').value;
  const status = $('#runStatusFilter').value;
  const sinceDays = Number($('#runSinceFilter').value) || 0;
  const since = sinceDays ? Date.now() - sinceDays * 86400000 : 0;

  return state.history
    .filter((r) => !project || r.project === project)
    .filter((r) => !status || r.status === status)
    .filter((r) => !since || new Date(r.startedAt).getTime() >= since)
    .slice()
    .reverse();
}

function renderRuns() {
  const tbody = $('#runsTable tbody');
  const runs = filteredRuns();
  if (!runs.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">אין ריצות להצגה</td></tr>';
    return;
  }
  tbody.innerHTML = runs
    .map(
      (r) => `
      <tr data-run-id="${r.id}">
        <td>${fmtDate(r.startedAt)}</td>
        <td>${r.project || '–'}</td>
        <td><span class="status-badge status-${r.status}">${statusLabel(r.status)}</span></td>
        <td>${r.total}</td>
        <td>${r.passed}</td>
        <td>${r.failed}</td>
        <td>${fmtDuration(r.durationMs)}</td>
        <td><button class="expand-btn" data-run-id="${r.id}">פרטים</button></td>
      </tr>`,
    )
    .join('');
}

function toggleRunDetail(runId, btn) {
  const row = btn.closest('tr');
  const next = row.nextElementSibling;
  if (next && next.classList.contains('run-detail')) {
    next.remove();
    btn.textContent = 'פרטים';
    return;
  }
  const run = state.history.find((r) => r.id === runId);
  const tr = document.createElement('tr');
  tr.className = 'run-detail';
  tr.innerHTML = `<td colspan="8">
    ${(run?.tests || [])
      .map(
        (t) => `
        <div class="test-row">
          <span>${escapeHtml(t.title)} <span class="badge status-${t.status}">${statusLabel(t.status)}</span></span>
          <span>${fmtDuration(t.durationMs)}</span>
        </div>
        ${t.errorMessage ? `<div class="error-detail" style="font-size:11px;margin:0 0 4px 20px">${escapeHtml(t.errorMessage)}</div>` : ''}`,
      )
      .join('') || '<div class="empty">אין פרטים</div>'}
  </td>`;
  row.after(tr);
  btn.textContent = 'סגור';
}

function aggregatedTests() {
  const map = new Map();
  for (const run of state.history) {
    for (const t of run.tests || []) {
      const key = `${t.project}|${t.title}`;
      const entry = map.get(key) || { title: t.title, project: t.project, total: 0, passed: 0, failed: 0, timedOut: 0, last: null, lastStatus: null };
      entry.total += 1;
      if (t.status === 'passed') entry.passed += 1;
      else if (t.status === 'failed') entry.failed += 1;
      else if (t.status === 'timedOut') entry.timedOut += 1;
      if (!entry.last || new Date(run.startedAt) > new Date(entry.last.startedAt)) {
        entry.last = run;
        entry.lastStatus = t.status;
      }
      map.set(key, entry);
    }
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'he'));
}

function renderTests() {
  const tbody = $('#testsTable tbody');
  const tests = aggregatedTests();
  if (!tests.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty">אין טסטים בדוח עדיין</td></tr>';
    return;
  }
  tbody.innerHTML = tests
    .map(
      (t) => `
      <tr data-test-title="${escapeHtml(t.title)}" data-test-project="${escapeHtml(t.project)}" class="test-row-clickable">
        <td>${escapeHtml(t.title)}</td>
        <td>${escapeHtml(t.project)}</td>
        <td>${t.total}</td>
        <td>${t.passed}</td>
        <td>${t.failed}</td>
        <td>${t.total ? `${Math.round((t.passed * 100) / t.total)}%` : '–'}</td>
        <td><span class="status-badge status-${t.lastStatus}">${statusLabel(t.lastStatus)}</span></td>
      </tr>`,
    )
    .join('');
}

function showHistory(title, project) {
  const entries = [];
  for (const run of state.history) {
    const t = (run.tests || []).find((x) => x.title === title && x.project === project);
    if (t) entries.push({ run, test: t });
  }
  $('#modalTitle').textContent = `${title} · ${project}`;
  if (!entries.length) {
    $('#modalBody').innerHTML = '<div class="empty">אין היסטוריה</div>';
  } else {
    $('#modalBody').innerHTML = `
      <div class="history-bars">
        ${entries
          .map(
            ({ run, test }) => `
          <div class="history-bar-row">
            <span>${fmtDate(run.startedAt)}</span>
            <div class="bar-track"><div class="bar-fill ${test.status}" style="width:100%"></div></div>
            <span>${statusLabel(test.status)} · ${fmtDuration(test.durationMs)}</span>
          </div>`,
          )
          .join('')}
      </div>`;
  }
  $('#historyModal').classList.remove('hidden');
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  $('#tab-runs').classList.toggle('hidden', name !== 'runs');
  $('#tab-tests').classList.toggle('hidden', name !== 'tests');
}

function init() {
  $('#modalClose').addEventListener('click', () => $('#historyModal').classList.add('hidden'));
  $('#historyModal').addEventListener('click', (e) => {
    if (e.target.id === 'historyModal') $('#historyModal').classList.add('hidden');
  });

  $('#runProjectFilter').addEventListener('change', renderRuns);
  $('#runStatusFilter').addEventListener('change', renderRuns);
  $('#runSinceFilter').addEventListener('change', renderRuns);

  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  $('#runsTable tbody').addEventListener('click', (e) => {
    const btn = e.target.closest('.expand-btn');
    if (btn) toggleRunDetail(btn.dataset.runId, btn);
  });

  $('#testsTable tbody').addEventListener('click', (e) => {
    const row = e.target.closest('.test-row-clickable');
    if (row) showHistory(row.dataset.testTitle, row.dataset.testProject);
  });

  loadData();
}

document.addEventListener('DOMContentLoaded', init);
