const express = require('express');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'config.json');
const DATA_FILE = path.join(__dirname, 'data.json');

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const app = express();
const PORT = config.server.port || 3456;

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  if (!fs.existsSync(DATA_FILE)) return { snapshots: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Serve config to frontend
app.get('/api/config', (req, res) => {
  res.json(config);
});

// Get all snapshots
app.get('/api/snapshots', (req, res) => {
  res.json(readData());
});

// Add a new daily snapshot
app.post('/api/snapshots', (req, res) => {
  const data = readData();
  const snapshot = {
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body
  };
  // Merge if same date exists (preserve existing fields)
  const idx = data.snapshots.findIndex(s => s.date === snapshot.date);
  if (idx >= 0) data.snapshots[idx] = { ...data.snapshots[idx], ...snapshot };
  else data.snapshots.push(snapshot);
  data.snapshots.sort((a, b) => a.date.localeCompare(b.date));
  writeData(data);
  res.json({ ok: true, snapshot });
});

app.listen(PORT, () => {
  console.log(`${config.publication.name} dashboard running at http://localhost:${PORT}`);
});
