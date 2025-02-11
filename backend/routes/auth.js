const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Acesso negado" });

    // Verifica se o token está revogado
    db.get("SELECT * FROM revoked_tokens WHERE token = ?", [token], (err, revokedToken) => {
        if (err) {
            console.error("Erro ao verificar token revogado:", err.message);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (revokedToken) {
            return res.status(403).json({ error: "Sessão expirada. Faça login novamente." });
        }

        // Verifica se o token é válido
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: "Token inválido" });
            req.user = user;
            next();
        });
    });
};

// Rota de login
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("E-mail inválido"),
        body("password").notEmpty().withMessage("Senha é obrigatória"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Verificar se o usuário existe
            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
                if (err) {
                    console.error("Erro ao verificar o usuário:", err.message);
                    return res.status(500).json({ error: "Erro interno do servidor" });
                }
                if (!user) {
                    return res.status(401).json({ error: "E-mail ou senha inválidos" });
                }
                // Comparar a senha
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({ error: "E-mail ou senha inválidos" });
                }
                // Gerar token JWT
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                res.json({ token });
            });
        } catch (error) {
            console.error("Erro durante o login:", error.message);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
);

// Rota de cadastro
router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("E-mail inválido"),
        body("password").isLength({ min: 8 }).withMessage("A senha deve ter pelo menos 8 caracteres"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Verificar se o usuário já existe
            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
                if (err) {
                    console.error("Erro ao verificar o usuário:", err.message);
                    return res.status(500).json({ error: "Erro interno do servidor" });
                }
                if (user) {
                    return res.status(400).json({ error: "E-mail já cadastrado" });
                }
                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(password, 10);
                // Inserir novo usuário no banco de dados
                db.run(
                    "INSERT INTO users (email, password) VALUES (?, ?)",
                    [email, hashedPassword],
                    (err) => {
                        if (err) {
                            console.error("Erro ao criar usuário:", err.message);
                            return res.status(500).json({ error: "Erro ao criar conta" });
                        }
                        // Gerar token JWT
                        db.get("SELECT * FROM users WHERE email = ?", [email], (err, newUser) => {
                            if (err) {
                                console.error("Erro ao buscar usuário recém-criado:", err.message);
                                return res.status(500).json({ error: "Erro ao criar conta" });
                            }
                            const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                            res.status(201).json({ message: "Conta criada com sucesso!", token });
                        });
                    }
                );
            });
        } catch (error) {
            console.error("Erro durante o cadastro:", error.message);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
);

// Rota de logout
router.post("/logout", authenticateToken, (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Armazena o token na tabela de tokens revogados
    db.run("INSERT INTO revoked_tokens (token) VALUES (?)", [token], (err) => {
        if (err) {
            console.error("Erro ao revogar token:", err.message);
            return res.status(500).json({ error: "Erro ao fazer logout" });
        }
        res.json({ message: "Logout realizado com sucesso!" });
    });
});

module.exports = router;