const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'botdata.db'), (err) => {
  if (err) console.error('DB Connection Error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Ensure table exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
});

module.exports = {
  getConfig: (key) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT value FROM config WHERE key = ?", [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      });
    });
  },
  setConfig: (key, value) => {
    return new Promise((resolve, reject) => {
      db.run("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", [key, value], function(err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  },
  getAllConfig: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM config", (err, rows) => {
        if (err) reject(err);
        else resolve(Object.fromEntries(rows.map(row => [row.key, row.value])));
      });
    });
  }
};