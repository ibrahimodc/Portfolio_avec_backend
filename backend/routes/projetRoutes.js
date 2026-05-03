/**
 * routes/projetRoutes.js
 * ─────────────────────────────────────────────────────
 * Routes REST pour la ressource "projets".
 * Monté sur /api/projets dans server.js.
 *
 * ┌──────────┬──────────────────────┬─────────────────────────────┐
 * │ Méthode  │ URL                  │ Action                      │
 * ├──────────┼──────────────────────┼─────────────────────────────┤
 * │ GET      │ /api/projets         │ Tous les projets            │
 * │ GET      │ /api/projets/:id     │ Un projet par ID            │
 * │ POST     │ /api/projets         │ Ajouter un projet           │
 * │ PUT      │ /api/projets/:id     │ Modifier un projet          │
 * │ DELETE   │ /api/projets/:id     │ Supprimer un projet         │
 * └──────────┴──────────────────────┴─────────────────────────────┘
 */

const express = require("express");
const path    = require("path");
const router  = express.Router();
const upload  = require("../middleware/upload");

const {
  getAllProjets,
  getProjetById,
  createProjet,
  updateProjet,
  deleteProjet,
} = require("../controllers/projetController");

// ── /api/projets ──────────────────────────────────────────────────────────────
router.route("/")
  .get(getAllProjets)
  .post(upload.single("image"), createProjet);

// ── /api/projets/:id ──────────────────────────────────────────────────────────
router.route("/:id")
  .get(getProjetById)
  .put(upload.single("image"), updateProjet)
  .delete(deleteProjet);

// ── /api/projets/upload — upload image seule, retourne l'URL ─────────────────
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url });
});

module.exports = router;
