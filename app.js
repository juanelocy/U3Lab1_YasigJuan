const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require('passport');
require('./src/config/passport-setup'); // Asegúrate que el archivo de estrategia se ejecute

const app = express();

// Inicializar Passport
app.use(passport.initialize());


const authRoutes = require("./src/api/routes/auth.routes");
const { connectDatabase } = require("./src/config/database");
const {
  initializeWebSockets,
} = require("./src/infrastructure/websockets/chat.handler");


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:3001",
      "http://127.0.0.1:5500", // Agrega esta línea
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDatabase();

// Rutas
app.use("/api/auth", authRoutes);

// Inicializar WebSockets
initializeWebSockets(io);

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Chat server is running" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal!" });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.get('/', (req, res) => {
  res.send('Backend corriendo correctamente');
});


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
