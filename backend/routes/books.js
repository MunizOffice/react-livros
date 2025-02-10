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
        body("title").notEmpty().withMessage("Título é obrigatório"),
        body("author").notEmpty().withMessage("Autor é obrigatório"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, description, thumbnail } = req.body;
        const userId = req.user.userId;

        db.run(
            "INSERT INTO books (userId, title, author, description, thumbnail) VALUES (?, ?, ?, ?, ?)",
            [userId, title, author, description, thumbnail],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Erro ao salvar o livro" });
                }
                res.status(201).json({ message: "Livro salvo com sucesso!" });
            }
        );
    }
);

router.post("/search", (req, res) => {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
        return res.status(400).json({ error: "Parâmetro de busca inválido" });
    }

    // Lógica para buscar livros no Google Books
    res.json({ message: "Busca realizada com sucesso!" });
});

module.exports = router;