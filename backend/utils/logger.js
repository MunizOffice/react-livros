const winston = require("winston");
const { createLogger, format, transports } = winston;
const DailyRotateFile = require("winston-daily-rotate-file");

// Define o formato dos logs
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Cria o logger
const logger = createLogger({
    level: "info", // Define o nível mínimo de logs (info, warn, error)
    format: logFormat,
    transports: [
        // Logs no console
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }),

        // Logs diários em arquivos rotativos
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true, // Compacta logs antigos
            maxSize: "20m", // Tamanho máximo por arquivo
            maxFiles: "14d", // Mantém logs por 14 dias
        }),

        // Logs de erros específicos
        new transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});

module.exports = logger;