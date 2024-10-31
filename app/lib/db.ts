import Database from 'better-sqlite3';
import path from 'path';

// Définit le chemin vers le fichier SQLite
const dbPath = path.resolve(process.cwd(), 'public/budget.db');
const db = new Database(dbPath);

// Crée la table transactions si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL
  )
`).run();

export default db;
