const sqlite3 = require('better-sqlite3');
const path = require('path');

let db;

function initializeDb() {
  if (!db) {
    db = sqlite3(path.join(__dirname, 'onderwijsdashboard.db'));
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

function transaction(callback) {
  const db = initializeDb();
  try {
    db.prepare('BEGIN').run();
    const result = callback(db);
    db.prepare('COMMIT').run();
    return result;
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
}

module.exports = {
  initializeDb,
  closeDb,
  transaction
};
