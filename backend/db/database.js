const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

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

// Função para criar usuário pré-cadastrado
const createPredefinedUser = async () => {
  const email = "usuario1@example.com";
  const password = "SenhaSegura123"; // Senha em texto plano
  const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      console.error("Erro ao verificar usuário pré-cadastrado:", err.message);
      return;
    }
    if (!user) {
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        (err) => {
          if (err) {
            console.error("Erro ao criar usuário pré-cadastrado:", err.message);
          } else {
            console.log("Usuário pré-cadastrado criado com sucesso!");
          }
        }
      );
    } else {
      console.log("Usuário pré-cadastrado já existe.");
    }
  });
};

// Chama a função para criar o usuário pré-cadastrado
createPredefinedUser();

module.exports = db;