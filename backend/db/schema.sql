-- Database schema for Onderwijsdashboard

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT,
  email TEXT,
  avatarUrl TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  groupId TEXT,
  avatar TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  averageScore REAL DEFAULT 0,
  achievements TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (groupId) REFERENCES groups(id)
);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  emoji TEXT,
  normalizedScore REAL DEFAULT 0,
  completeness REAL DEFAULT 0,
  quality REAL DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges TEXT,
  dailyScores TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE group_members (
  groupId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  joinedAt TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (groupId, studentId),
  FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  dueDate TEXT,
  status TEXT DEFAULT 'open',
  submissionCount INTEGER DEFAULT 0,
  totalGroups INTEGER DEFAULT 0,
  xpReward INTEGER DEFAULT 100,
  difficulty TEXT DEFAULT 'medium',
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  assignmentId TEXT NOT NULL,
  groupId TEXT NOT NULL,
  submittedAt TEXT DEFAULT (datetime('now')),
  status TEXT DEFAULT 'pending',
  scores TEXT,
  feedback TEXT,
  FOREIGN KEY (assignmentId) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (groupId) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE uploads (
  id TEXT PRIMARY KEY,
  submissionId TEXT NOT NULL,
  fileName TEXT NOT NULL,
  filePath TEXT NOT NULL,
  fileSize INTEGER,
  mimeType TEXT,
  uploadedBy TEXT,
  uploadedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (submissionId) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (uploadedBy) REFERENCES students(id)
);

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  xpReward INTEGER DEFAULT 0
);

CREATE TABLE student_achievements (
  studentId TEXT NOT NULL,
  achievementId TEXT NOT NULL,
  awardedAt TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (studentId, achievementId),
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (achievementId) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE INDEX idx_students_groupId ON students(groupId);
CREATE INDEX idx_submissions_assignmentId ON submissions(assignmentId);
CREATE INDEX idx_submissions_groupId ON submissions(groupId);
CREATE INDEX idx_uploads_submissionId ON uploads(submissionId);
