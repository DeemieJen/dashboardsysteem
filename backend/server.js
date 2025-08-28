// Basic Express server for Onderwijsdashboard Systeem
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { initializeDb, closeDb, transaction } = require('./db');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const db = initializeDb();

// API endpoints for new SQLite-based system
app.get('/api/assignments', (req, res) => {
  try {
    const assignments = db.prepare(`
      SELECT a.*, g.name as group_name 
      FROM assignments a 
      LEFT JOIN groups g ON a.group_id = g.id
    `).all();
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

app.post('/api/assignments', (req, res) => {
  try {
    const { title, description, due_date, assignment_type, group_id } = req.body;
    const result = db.prepare(`
      INSERT INTO assignments (title, description, due_date, assignment_type, group_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description, due_date, assignment_type, group_id);
    
    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

app.put('/api/assignments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, assignment_type, group_id } = req.body;
    
    db.prepare(`
      UPDATE assignments 
      SET title = ?, description = ?, due_date = ?, assignment_type = ?, group_id = ?
      WHERE id = ?
    `).run(title, description, due_date, assignment_type, group_id, id);
    
    const assignment = db.prepare(`
      SELECT a.*, g.name as group_name 
      FROM assignments a 
      LEFT JOIN groups g ON a.group_id = g.id 
      WHERE a.id = ?
    `).get(id);
    
    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

app.delete('/api/assignments/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

app.get('/api/groups', (req, res) => {
  try {
    const groups = db.prepare(`
      SELECT g.*, COUNT(s.id) as student_count
      FROM groups g
      LEFT JOIN students s ON g.id = s.group_id
      GROUP BY g.id
    `).all();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

app.post('/api/groups', (req, res) => {
  try {
    const { name, description } = req.body;
    const result = db.prepare(`
      INSERT INTO groups (name, description)
      VALUES (?, ?)
    `).run(name, description);
    
    const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...group, student_count: 0 });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

app.put('/api/groups/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    db.prepare(`
      UPDATE groups 
      SET name = ?, description = ?
      WHERE id = ?
    `).run(name, description, id);
    
    const group = db.prepare(`
      SELECT g.*, COUNT(s.id) as student_count
      FROM groups g
      LEFT JOIN students s ON g.id = s.group_id
      WHERE g.id = ?
      GROUP BY g.id
    `).get(id);
    
    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

app.delete('/api/groups/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM groups WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

app.get('/api/students', (req, res) => {
  try {
    const students = db.prepare(`
      SELECT s.*, g.name as group_name
      FROM students s
      LEFT JOIN groups g ON s.group_id = g.id
    `).all();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', (req, res) => {
  try {
    const { name, email, group_id } = req.body;
    const result = db.prepare(`
      INSERT INTO students (name, email, group_id)
      VALUES (?, ?, ?)
    `).run(name, email, group_id);
    
    const student = db.prepare(`
      SELECT s.*, g.name as group_name
      FROM students s
      LEFT JOIN groups g ON s.group_id = g.id
      WHERE s.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.post('/api/students/bulk', (req, res) => {
  try {
    const { students } = req.body;
    let created = 0;
    let errors = [];

    for (const student of students) {
      try {
        db.prepare(`
          INSERT INTO students (name, email, group_id)
          VALUES (?, ?, ?)
        `).run(student.name, student.email, student.group_id);
        created++;
      } catch (error) {
        errors.push(`Failed to create student ${student.name}: ${error.message}`);
      }
    }

    res.json({ created, errors });
  } catch (error) {
    console.error('Error bulk creating students:', error);
    res.status(500).json({ error: 'Failed to bulk create students' });
  }
});

app.delete('/api/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.patch('/api/students/:id/avatar', (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url } = req.body;
    
    if (!avatar_url) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }
    
    db.prepare('UPDATE students SET avatar_url = ? WHERE id = ?').run(avatar_url, id);
    
    const student = db.prepare(`
      SELECT s.*, g.name as group_name
      FROM students s
      LEFT JOIN groups g ON s.group_id = g.id
      WHERE s.id = ?
    `).get(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

app.get('/api/submissions', (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT s.*, st.name as student_name, a.title as assignment_title
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN assignments a ON s.assignment_id = a.id
    `).all();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Legacy endpoints for compatibility (these map old structure to new SQLite structure)
app.get('/students', (req, res) => {
  try {
    const students = db.prepare(`
      SELECT s.*, g.name as group_name
      FROM students s
      LEFT JOIN groups g ON s.group_id = g.id
    `).all();
    
    // Transform to legacy format
    const legacyStudents = students.map(s => ({
      id: s.id.toString(),
      name: s.name,
      groupId: s.group_id,
      avatar: s.avatar_url || '',
      level: 1,
      xp: 0,
      streak: 0,
      averageScore: 0,
      achievements: []
    }));
    
    res.json(legacyStudents);
  } catch (error) {
    console.error('Error fetching students (legacy):', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/groups', (req, res) => {
  try {
    const groups = db.prepare(`
      SELECT g.*, COUNT(s.id) as student_count
      FROM groups g
      LEFT JOIN students s ON g.id = s.group_id
      GROUP BY g.id
    `).all();
    
    // Transform to legacy format
    const legacyGroups = groups.map(g => ({
      id: g.id.toString(),
      name: g.name,
      description: g.description || '',
      members: [],
      badges: [],
      dailyScores: []
    }));
    
    res.json(legacyGroups);
  } catch (error) {
    console.error('Error fetching groups (legacy):', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

app.get('/assignments', (req, res) => {
  try {
    const assignments = db.prepare(`
      SELECT a.*, g.name as group_name 
      FROM assignments a 
      LEFT JOIN groups g ON a.group_id = g.id
    `).all();
    
    // Transform to legacy format
    const legacyAssignments = assignments.map(a => ({
      id: a.id.toString(),
      title: a.title,
      description: a.description,
      dueDate: a.due_date,
      status: 'Open',
      submissionCount: 0,
      totalGroups: 0,
      xpReward: 100,
      difficulty: 'medium'
    }));
    
    res.json(legacyAssignments);
  } catch (error) {
    console.error('Error fetching assignments (legacy):', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

app.get('/submissions', (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT s.*, st.name as student_name, a.title as assignment_title
      FROM submissions s
      JOIN students st ON s.student_id = st.id
      JOIN assignments a ON s.assignment_id = a.id
    `).all();
    
    // Transform to legacy format
    const legacySubmissions = submissions.map(s => ({
      id: s.id.toString(),
      studentId: s.student_id.toString(),
      assignmentId: s.assignment_id.toString(),
      submittedAt: s.submitted_at,
      scores: {}
    }));
    
    res.json(legacySubmissions);
  } catch (error) {
    console.error('Error fetching submissions (legacy):', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});
