const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const NodeCache = require("node-cache");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

// Configuração do cache
const cache = new NodeCache({ stdTTL: 300 }); // TTL de 5 minutos (300 segundos)

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware de cache apenas para rotas específicas
app.use((req, res, next) => {
    // Aplica cache apenas para as rotas /auth/login e /auth/signup
    if (
        req.method === "GET" &&
        (req.url === "/auth/login" || req.url === "/auth/signup")
    ) {
        const cacheKey = req.originalUrl || req.url;
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            console.log(`Resposta retornada do cache para: ${cacheKey}`);
            return res.json(cachedResponse);
        }
        // Se não houver cache, armazena a resposta após a execução da rota
        const originalSend = res.send;
        res.send = function (body) {
            cache.set(cacheKey, body);
            originalSend.call(this, body);
        };
    }
    next();
});

// Função para limpar o cache de uma rota específica
app.clearCache = (route) => {
    const cacheKey = route;
    if (cache.has(cacheKey)) {
        cache.del(cacheKey);
        console.log(`Cache limpo para a rota: ${cacheKey}`);
    }
};

// Rotas
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

module.exports = app;