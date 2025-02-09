const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { body, validationResult } = require("express-validator");

const router = express.Router();

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
                    return res.status(500).json({ error: "Erro ao verificar o usuário" });
                }
                if (user) {
                    return res.status(400).json({ error: "Já existe uma conta com esse e-mail" });
                }

                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(password, 10);

                // Inserir o novo usuário no banco de dados
                db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function (err) {
                    if (err) {
                        return res.status(500).json({ error: "Erro ao criar o usuário" });
                    }
                    res.status(201).json({ message: "Usuário criado com sucesso!" });
                });
            });
        } catch (error) {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
);

// Rota de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar se o usuário existe
        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao verificar o usuário" });
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
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;