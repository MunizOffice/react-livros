const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { body, validationResult } = require("express-validator");
const router = express.Router();

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

module.exports = router;