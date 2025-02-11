const fs = require("fs");
const https = require("https");
const app = require("./app");

// Certificados SSL
const privateKey = fs.readFileSync("./ssl/key.pem", "utf8");
const certificate = fs.readFileSync("./ssl/cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Porta do servidor
const PORT_HTTP = process.env.PORT || 5000;
const PORT_HTTPS = 5443; // Porta padrão para HTTPS

// Servidor HTTP (redirecionará para HTTPS)
const http = require("http");
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(PORT_HTTP, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT_HTTP} (redirecionando para HTTPS)`);
});

// Servidor HTTPS
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT_HTTPS, () => {
    console.log(`Servidor HTTPS rodando na porta ${PORT_HTTPS}`);
});