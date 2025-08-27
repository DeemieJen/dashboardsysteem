// Basic Express server for Onderwijsdashboard Systeem
const express = require('express');
const cors = require('cors');
const data = require('./data');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// Endpoints for data
app.get('/students', (req, res) => res.json(data.students));
app.get('/groups', (req, res) => res.json(data.groups));
app.get('/assignments', (req, res) => res.json(data.assignments));
app.get('/submissions', (req, res) => res.json(data.submissions));

// Assignment CRUD
app.post('/assignments', (req, res) => {
  const assignment = req.body;
  assignment.id = `a${Date.now()}`;
  assignment.submissionCount = 0;
  assignment.totalGroups = assignment.groups ? assignment.groups.length : 0;
  assignment.status = 'Open';
  assignment.dueDate = new Date(assignment.dueDate);
  data.assignments.push(assignment);
  res.status(201).json(assignment);
});

app.put('/assignments/:id', (req, res) => {
  const { id } = req.params;
  const idx = data.assignments.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const updated = { ...data.assignments[idx], ...req.body };
  if (req.body.dueDate) updated.dueDate = new Date(req.body.dueDate);
  data.assignments[idx] = updated;
  res.json(updated);
});

app.delete('/assignments/:id', (req, res) => {
  const { id } = req.params;
  const idx = data.assignments.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.assignments.splice(idx, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
