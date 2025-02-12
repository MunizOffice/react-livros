const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const logger = require("../utils/logger"); // Importa o logger


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
            logger.warn("Tentativa de login com dados inválidos.");
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Verificar se o usuário existe
            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
                if (err) {
                    logger.error(`Erro ao verificar o usuário: ${err.message}`);
                    return res.status(500).json({ error: "Erro interno do servidor" });
                }
                if (!user) {
                    logger.warn(`Tentativa de login com e-mail inexistente: ${email}`);
                    return res.status(401).json({ error: "E-mail ou senha inválidos" });
                }
                // Comparar a senha
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    logger.warn(`Tentativa de login com senha incorreta para o e-mail: ${email}`);
                    return res.status(401).json({ error: "E-mail ou senha inválidos" });
                }
                // Gerar token JWT
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
                logger.info(`Login bem-sucedido para o e-mail: ${email}`);
                res.json({ token });
            });
        } catch (error) {
            logger.error(`Erro durante o login: ${error.message}`);
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
            logger.warn("Tentativa de cadastro com dados inválidos.");
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Verificar se o usuário já existe
            db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
                if (err) {
                    logger.error(`Erro ao verificar o usuário: ${err.message}`);
                    return res.status(500).json({ error: "Erro interno do servidor" });
                }
                if (user) {
                    logger.warn(`Tentativa de cadastro com e-mail já existente: ${email}`);
                    return res.status(400).json({ error: "E-mail já cadastrado" });
                }
                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(password, 10);
                // Inserir novo usuário no banco de dados
                db.run(
                    "INSERT INTO users (email, password) VALUES (?, ?)",
                    [email, hashedPassword],
                    async (err) => {
                        if (err) {
                            logger.error(`Erro ao criar usuário: ${err.message}`);
                            return res.status(500).json({ error: "Erro ao criar conta" });
                        }
                        // Buscar o usuário recém-criado
                        db.get("SELECT * FROM users WHERE email = ?", [email], (err, newUser) => {
                            if (err) {
                                logger.error(`Erro ao buscar usuário recém-criado: ${err.message}`);
                                return res.status(500).json({ error: "Erro ao criar conta" });
                            }
                            // Gerar token JWT
                            const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
                            logger.info(`Usuário criado com sucesso: ${email}`);
                            res.status(201).json({ message: "Conta criada com sucesso!", token });
                        });
                    }
                );
            });
        } catch (error) {
            logger.error(`Erro durante o cadastro: ${error.message}`);
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