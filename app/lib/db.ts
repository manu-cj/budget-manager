import Database from 'better-sqlite3';
import path from 'path';

// Définition du chemin vers le fichier SQLite
const dbPath = path.resolve(process.cwd(), 'public/budget.db');
const db = new Database(dbPath);

// Création de la table des utilisateurs
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

// Création de la table des catégories de dépenses
db.prepare(`
    CREATE TABLE IF NOT EXISTS expense_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL UNIQUE
    )
`).run();

// Insertion des catégories de dépenses par défaut
const expenseCategories = [
    'Logement', 'Nourriture', 'Transport', 'Santé', 'Loisirs',
    'Abonnements', 'Assurances', 'Éducation', 'Remboursements', 
    'Épargne', 'Animaux','Cadeaux et Événements', 'Divers', 'Vacances'
];

expenseCategories.forEach(category => {
    db.prepare(`
        INSERT OR IGNORE INTO expense_categories (name) VALUES (?)
    `).run(category);
});

// Création de la table des catégories de revenus
db.prepare(`
    CREATE TABLE IF NOT EXISTS revenue_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL UNIQUE
    )
`).run();

// Insertion des catégories de revenus par défaut
const revenueCategories = [
    'Salaire', 'Freelance', 'Investissements', 'Ventes', 'Autres'
];

revenueCategories.forEach(category => {
    db.prepare(`
        INSERT OR IGNORE INTO revenue_categories (name) VALUES (?)
    `).run(category);
});

console.log('Les catégories de dépenses et de revenus ont été ajoutées avec succès.');

// Création de la table des dépenses
db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        user_id TEXT,
        category_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES expense_categories (id) ON DELETE SET NULL
    )
`).run();

// Création de la table des revenus
db.prepare(`
    CREATE TABLE IF NOT EXISTS revenues (
        id TEXT PRIMARY KEY NOT NULL, 
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        user_id TEXT,
        category_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES revenue_categories (id) ON DELETE SET NULL
    )
`).run();

// Création de la table des budgets
db.prepare(`
    CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        housing REAL DEFAULT 800.0,  
        food REAL DEFAULT 300.0,    
        transportation REAL DEFAULT 150.0, 
        health REAL DEFAULT 100.0,    
        leisure REAL DEFAULT 100.0,    
        subscriptions REAL DEFAULT 200.0,
        insurance REAL DEFAULT 75.0,   
        education REAL DEFAULT 50.0,    
        repayments REAL DEFAULT 50.0,    
        savings REAL DEFAULT 100.0,
        animals REAL DEFAULT 50.0,      
        gifts_and_events REAL DEFAULT 50.0, 
        miscellaneous REAL DEFAULT 25.0,  
        vacation REAL DEFAULT 50.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
`).run();


export default db;
