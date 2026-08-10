const fs = require('fs');
const path = require('path');

const MAX_RUNS = 200;
const dataDir = path.join(__dirname, '..', 'dashboard', 'dashboard-data');
const latestPath = path.join(dataDir, 'latest.json');
const historyPath = path.join(dataDir, 'history.json');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return null;
  }
}

function main() {
  const latest = readJSON(latestPath);
  if (!latest || !latest.id) {
    console.log('[merge-history] no latest.json found, nothing to merge');
    return;
  }

  let history = readJSON(historyPath);
  if (!Array.isArray(history)) history = [];

  const idx = history.findIndex((r) => r.id === latest.id);
  if (idx >= 0) {
    history[idx] = latest;
  } else {
    history.push(latest);
  }

  history.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  history = history.slice(-MAX_RUNS);

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  console.log(`[merge-history] merged run ${latest.id} (${latest.status}); history now has ${history.length} runs`);
}

main();
