const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const dotenv = require("dotenv");
const NodeCache = require("node-cache");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const logger = require("./utils/logger"); // Importa o logger

// Configuração do cache
const cache = new NodeCache({ stdTTL: 300 }); // TTL de 5 minutos (300 segundos)
dotenv.config();

const app = express();

// Middleware de compressão
app.use(
    compression({
        threshold: 0, // Comprime todas as respostas
        filter: (req, res) => {
            const acceptEncoding = req.headers["accept-encoding"] || "";
            return !/br/i.test(acceptEncoding); // Desativa Brotli se o cliente aceitar gzip
        },
    })
);

// Outros middlewares
app.use(cors());
app.use(bodyParser.json());

// Middleware de cache apenas para rotas específicas
app.use((req, res, next) => {
    if (
        req.method === "GET" &&
        (req.url === "/auth/login" || req.url === "/auth/signup")
    ) {
        const cacheKey = req.originalUrl || req.url;
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            logger.info(`Resposta retornada do cache para: ${cacheKey}`);
            return res.json(cachedResponse);
        }
        // Sem o cache vai armazenar a resposta após a execução da rota
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
        logger.info(`Cache limpo para a rota: ${cacheKey}`);
    }
};

// Rotas
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

// Middleware para capturar erros globais
app.use((err, req, res, next) => {
    logger.error(`Erro global capturado: ${err.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;