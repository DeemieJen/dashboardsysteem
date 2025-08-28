const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Import mock data
const mockData = require('../data');

const dbDir = path.join(__dirname);
const dbPath = path.join(dbDir, 'onderwijsdashboard.db');

// Remove old DB for clean migration (CAUTION: disables persistence!)
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = sqlite3(dbPath);

// Load and execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

db.transaction(() => {
  // Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, role, name, email, avatarUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  insertUser.run(
    uuidv4(),
    'admin',
    hashedPassword,
    'admin',
    'Administrator',
    'admin@example.com',
    null
  );

  // Groups
  const insertGroup = db.prepare(`
    INSERT INTO groups (id, name, color, emoji, normalizedScore, completeness, quality, level, xp, streak, badges, dailyScores)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  mockData.groups.forEach(group => {
    insertGroup.run(
      group.id,
      group.name,
      group.color || null,
      group.emoji || null,
      group.normalizedScore || 0,
      group.completeness || 0,
      group.quality || 0,
      group.level || 1,
      group.xp || 0,
      group.streak || 0,
      JSON.stringify(group.badges || []),
      JSON.stringify(group.dailyScores || []),
    );
    // Insert group members if present
    if (Array.isArray(group.members)) {
      group.members.forEach(studentId => {
        try {
          insertGroupMember.run(group.id, studentId);
        } catch (e) {}
      });
    }
  });

  // Students
  const insertStudent = db.prepare(`
    INSERT INTO students (id, name, groupId, avatar, level, xp, streak, averageScore, achievements)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertGroupMember = db.prepare(`
    INSERT INTO group_members (groupId, studentId)
    VALUES (?, ?)
  `);
  mockData.students.forEach(student => {
    insertStudent.run(
      student.id,
      student.name,
      student.groupId || null,
      student.avatar || null,
      student.level || 1,
      student.xp || 0,
      student.streak || 0,
      student.averageScore || 0,
      JSON.stringify(student.achievements || [])
    );
    // Insert group membership if groupId is present
    if (student.groupId) {
      try {
        insertGroupMember.run(student.groupId, student.id);
      } catch (e) {}
    }
    // Insert professionalityScores as a separate JSON field if needed
    if (student.professionalityScores) {
      // Optionally, add a column or a new table for these scores
    }
  });

  // Assignments
  const insertAssignment = db.prepare(`
    INSERT INTO assignments (id, title, description, dueDate, status, submissionCount, totalGroups, xpReward, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  mockData.assignments.forEach(assignment => {
    insertAssignment.run(
      assignment.id,
      assignment.title,
      assignment.description || null,
      assignment.dueDate ? (typeof assignment.dueDate === 'string' ? assignment.dueDate : assignment.dueDate.toISOString()) : null,
      assignment.status || 'open',
      assignment.submissionCount || 0,
      assignment.totalGroups || 0,
      assignment.xpReward || 100,
      assignment.difficulty || 'medium'
    );
  });

  // Submissions
  const insertSubmission = db.prepare(`
    INSERT INTO submissions (id, assignmentId, groupId, submittedAt, status, scores, feedback)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  mockData.submissions.forEach(submission => {
    insertSubmission.run(
      submission.id,
      submission.assignmentId,
      submission.groupId,
      submission.submittedAt ? (typeof submission.submittedAt === 'string' ? submission.submittedAt : submission.submittedAt.toISOString()) : new Date().toISOString(),
      submission.status || 'pending',
      JSON.stringify(submission.scores || {}),
      submission.feedback || null
    );
  });

  // Uploads (if present)
  if (mockData.uploads) {
    const insertUpload = db.prepare(`
      INSERT INTO uploads (id, submissionId, fileName, filePath, fileSize, mimeType, uploadedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    mockData.uploads.forEach(upload => {
      insertUpload.run(
        upload.id,
        upload.submissionId,
        upload.fileName,
        upload.filePath,
        upload.fileSize || null,
        upload.mimeType || null,
        upload.uploadedBy || null
      );
    });
  }

  // Achievements (if present)
  if (mockData.achievements) {
    const insertAchievement = db.prepare(`
      INSERT INTO achievements (id, name, description, icon, category, xpReward)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    mockData.achievements.forEach(ach => {
      insertAchievement.run(
        ach.id,
        ach.name,
        ach.description || null,
        ach.icon || null,
        ach.category || null,
        ach.xpReward || 0
      );
    });
  }

  // Student achievements (if present)
  if (mockData.studentAchievements) {
    const insertStudentAchievement = db.prepare(`
      INSERT INTO student_achievements (studentId, achievementId, awardedAt)
      VALUES (?, ?, ?)
    `);
    mockData.studentAchievements.forEach(sa => {
      insertStudentAchievement.run(
        sa.studentId,
        sa.achievementId,
        sa.awardedAt || new Date().toISOString()
      );
    });
  }

  console.log('Database migration completed successfully');
})();

db.close();
