import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  
  // Создаем таблицу избранного
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      trackId INTEGER,
      title TEXT,
      artist TEXT,
      duration INTEGER,
      image TEXT,
      UNIQUE(userId, trackId)
    )
  `);
});

export default db;
