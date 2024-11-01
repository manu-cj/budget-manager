import Database from 'better-sqlite3';
import path from 'path';

// Définit le chemin vers le fichier SQLite
const dbPath = path.resolve(process.cwd(), 'public/budget.db');
const db = new Database(dbPath);

// Crée la table des utilisateurs si elle n'existe pas
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, 
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `).run();

// Crée la table des catégories de dépenses si elle n'existe pas
db.prepare(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL UNIQUE
    )
  `).run();
  
// Insertion des catégories de dépenses par défaut
const expenseCategories = [
  'Logement',
  'Nourriture',
  'Transport',
  'Santé',
  'Loisirs',
  'Abonnements',
  'Assurances',
  'Éducation',
  'Remboursements',
  'Épargne',
  'Cadeaux et Événements',
  'Divers'
];

expenseCategories.forEach(category => {
  db.prepare(`
    INSERT OR IGNORE INTO expense_categories (name) VALUES (?)
  `).run(category);
});

// Crée la table des catégories de revenus si elle n'existe pas
db.prepare(`
    CREATE TABLE IF NOT EXISTS revenue_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL UNIQUE
    )
  `).run();
  
// Insertion des catégories de revenus par défaut
const revenueCategories = [
  'Salaire',
  'Freelance',
  'Investissements',
  'Ventes',
  'Autres'
];

revenueCategories.forEach(category => {
  db.prepare(`
    INSERT OR IGNORE INTO revenue_categories (name) VALUES (?)
  `).run(category);
});

console.log('Catégories ajoutées avec succès !');

// Crée la table des dépenses si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    user_id TEXT,
    category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES expense_categories (id)
  )
`).run();

// Crée la table des revenus si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS revenues (
    id TEXT PRIMARY KEY, 
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    user_id TEXT,
    category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES revenue_categories (id)
  )
`).run();


export default db;
