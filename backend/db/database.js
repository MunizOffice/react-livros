const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Conexão com o banco de dados
const dbPath = path.resolve(__dirname, "../../database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conexão com o banco de dados estabelecida.");
    // Criar tabelas, se não existirem
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        thumbnail TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);
  }
});

module.exports = db;