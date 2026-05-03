/**
 * models/Projet.js
 * ─────────────────────────────────────────────────────
 * Modèle Mongoose pour la ressource "Projet".
 *
 * Champs :
 *   libelle      — Titre du projet                  (obligatoire)
 *   image        — URL de l'image de couverture      (obligatoire)
 *   description  — Description détaillée             (obligatoire)
 *   technologies — Tableau de technologies utilisées (obligatoire, ≥ 1)
 *   lien         — URL du dépôt ou de la démo        (optionnel)
 *   dateCreation — Date de création                  (défaut : aujourd'hui)
 */

const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema(
  {
    libelle: {
      type: String,
      required: [true, "Le libellé du projet est obligatoire."],
      trim: true,
      maxlength: [150, "Le libellé ne peut pas dépasser 150 caractères."],
    },

    image: {
      type: String,
      required: [false, "L'URL de l'image est obligatoire."],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La description est obligatoire."],
      trim: true,
      maxlength: [1000, "La description ne peut pas dépasser 1 000 caractères."],
    },

    technologies: {
      type: [String],
      required: [true, "Au moins une technologie est requise."],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Le projet doit comporter au moins une technologie.",
      },
    },

    lien: {
      type: String,
      trim: true,
      default: null,
    },

    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,      // Ajoute createdAt / updatedAt automatiquement
    collection: "projets", // Nom explicite de la collection MongoDB
  }
);

// Index full-text pour la recherche par libellé ou description
projetSchema.index({ libelle: "text", description: "text" });

const Projet = mongoose.model("Projet", projetSchema);

module.exports = Projet;
