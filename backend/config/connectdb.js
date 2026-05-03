/**
 * config/connectdb.js
 * ─────────────────────────────────────────────────────
 * Module de connexion à MongoDB via Mongoose.
 * Charge MONGO_URI depuis les variables d'environnement (.env).
 * Arrête le processus si la connexion échoue au démarrage.
 */


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅  MongoDB connecté  →  hôte : ${conn.connection.host}  |  base : ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`❌  Erreur de connexion MongoDB : ${error.message}`);
    // Arrêt immédiat si la base est inaccessible au démarrage
    process.exit(1);
  }
};

// ── Événements de cycle de vie ────────────────────────────────────────────────
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️   MongoDB déconnecté.")
);
mongoose.connection.on("reconnected", () =>
  console.info("🔄  MongoDB reconnecté.")
);

module.exports = connectDB;
