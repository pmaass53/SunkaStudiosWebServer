console.log("auth_db.js: Initiating Authorization Database...")

// import sqlite3 package for database
import sqlite3 from "sqlite3"
// set constant for path to auth database
// NOTE: path is relative to server.js
const AUTH_DB_PATH = "./database/data/auth.db"

const AUTHDB = new sqlite3.Database(AUTH_DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err1) => {
  if (err1) {
    console.log("auth_db.js: Error Opening/Creating Auth Database")
    console.error(err1)
  } else {
    AUTHDB.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err2) => {
      if (err2) {
        console.log("auth_db.js: Error Creating Tables Auth Database")
        console.error(err2)
      } else {
        console.log("auth_db.js: Auth Database Setup Complete")
      }
    })
  }
})
export function getUser(username, callback) {
  AUTHDB.get("SELECT * FROM users WHERE username = ?", [username], callback);
}

export function createUser(username, password, callback) {
  bcrypt.hash(password, 10).then(hash => {
    AUTHDB.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hash], callback);
  });
}
