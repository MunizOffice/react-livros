const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

module.exports = app;