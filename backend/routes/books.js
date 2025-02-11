const express = require("express");
const db = require("../db/database");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Acesso negado" });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        req.user = user;
        next();
    });
};

// Rota para buscar livros salvos pelo usuário
router.get("/", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    db.all("SELECT * FROM books WHERE userId = ?", [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar livros" });
        }
        res.json(rows);
    });
});

// Rota para salvar um livro no banco de dados
router.post(
    "/",
    authenticateToken,
    [
        body("title").notEmpty().withMessage("Título é obrigatório"), // Título é obrigatório
        // Autor não precisa de validação, pois será preenchido com um valor padrão
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, description, thumbnail } = req.body;
        const userId = req.user.userId;

        // Define "Autor Desconhecido" como valor padrão para o autor, se não for fornecido
        const finalAuthor = author || "Autor Desconhecido";

        db.run(
            "INSERT INTO books (userId, title, author, description, thumbnail) VALUES (?, ?, ?, ?, ?)",
            [userId, title, finalAuthor, description, thumbnail],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Erro ao salvar o livro" });
                }
                res.status(201).json({ message: "Livro salvo com sucesso!" });
            }
        );
    }
);

// Rota para excluir um livro
router.delete("/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verifica se o livro pertence ao usuário logado
    db.get("SELECT * FROM books WHERE id = ? AND userId = ?", [id, userId], (err, book) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao verificar o livro" });
        }
        if (!book) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        // Exclui o livro
        db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao excluir o livro" });
            }
            res.json({ message: "Livro excluído com sucesso!" });
        });
    });
});

// Rota para realizar uma busca
router.post("/search", (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== "string" || query.trim() === "") {
        return res.status(400).json({ error: "Parâmetro de busca inválido" });
    }
    // Lógica para buscar livros no Google Books
    res.json({ message: "Busca realizada com sucesso!" });
});

module.exports = router;