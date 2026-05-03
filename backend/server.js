/**
 * server.js
 * ─────────────────────────────────────────────────────
 * Point d'entrée de l'API REST Portfolio
 * Stack : Express.js + MongoDB (Mongoose)
 */

require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const connectDB    = require("./config/connectdb");
const projetRoutes = require("./routes/projetRoutes");

// ── Connexion à MongoDB ───────────────────────────────────────────────────────
connectDB();

// ── Application Express ───────────────────────────────────────────────────────
const app = express();
const path = require("path");

// Autorise les requêtes depuis le frontend React (tous les ports localhost en dev)
app.use(cors({ 
  origin: (origin, callback) => {
    // Autoriser localhost en développement
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Parsers JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requêtes (développement uniquement)
if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}`);
    next();
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────
// Servir les images uploadées (accessible en dev et prod)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Servir les fichiers statiques du frontend compilé en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

// Route de santé
app.get("/", (_req, res) =>
  res.status(200).json({ success: true, message: "🚀 API Portfolio opérationnelle.", version: "1.0.0" })
);

// Route de santé de la base de données
app.get("/health", async (_req, res) => {
  try {
    const mongoose = require("mongoose");
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ success: true, message: "Base de données connectée.", status: "healthy" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur de connexion à la base de données.", status: "unhealthy" });
  }
});

// Ressource projets
app.use("/api/projets", projetRoutes);

// Servir index.html pour les routes React en production
if (process.env.NODE_ENV === "production") {
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// 404 — Route inconnue
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Ressource introuvable." })
);

// Gestionnaire d'erreurs global
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Erreur non gérée :", err.stack);
  res.status(500).json({
    success: false,
    message: "Erreur interne du serveur.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ── Démarrage ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🌐  Mode         : ${process.env.NODE_ENV || "development"}`);
  console.log(`📡  Serveur      : http://localhost:${PORT}`);
  console.log(`🔗  API Projets  : http://localhost:${PORT}/api/projets\n`);
});
