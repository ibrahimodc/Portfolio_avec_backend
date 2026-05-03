const Projet = require("../models/Projet");

const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

// GET /api/projets
const getAllProjets = async (req, res) => {
  try {
    const projets = await Projet.find().sort({ dateCreation: -1 });
    res.status(200).json({ success: true, count: projets.length, data: projets });
  } catch (error) {
    console.error("[getAllProjets]", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des projets." });
  }
};

// GET /api/projets/:id
const getProjetById = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ success: false, message: `Identifiant invalide : "${id}".` });
  try {
    const projet = await Projet.findById(id);
    if (!projet) return res.status(404).json({ success: false, message: `Aucun projet trouvé avec l'identifiant ${id}.` });
    res.status(200).json({ success: true, data: projet });
  } catch (error) {
    console.error("[getProjetById]", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération du projet." });
  }
};

// POST /api/projets — supporte fichier uploadé OU URL
const createProjet = async (req, res) => {
  try {
    const { libelle, description, technologies, lien, dateCreation } = req.body;

    // Image : fichier multer OU URL texte
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : (req.body.image || "");

    if (!libelle || !image || !description || !technologies) {
      return res.status(400).json({
        success: false,
        message: "Les champs libelle, image, description et technologies sont obligatoires.",
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : technologies.split(",").map((t) => t.trim()).filter(Boolean);

    const nouveauProjet = await Projet.create({
      libelle,
      image,
      description,
      technologies: techArray,
      lien: lien || null,
      dateCreation: dateCreation || Date.now(),
    });

    res.status(201).json({ success: true, message: "Projet ajouté avec succès.", data: nouveauProjet });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Erreur de validation.", errors: messages });
    }
    console.error("[createProjet]", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la création du projet." });
  }
};

// PUT /api/projets/:id — supporte fichier uploadé OU URL
const updateProjet = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ success: false, message: `Identifiant invalide : "${id}".` });

  try {
    const updateData = { ...req.body };

    // Si un fichier est uploadé, on remplace l'image
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Normaliser technologies si c'est une string
    if (updateData.technologies && typeof updateData.technologies === "string") {
      updateData.technologies = updateData.technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const projetMisAJour = await Projet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!projetMisAJour) return res.status(404).json({ success: false, message: `Aucun projet trouvé avec l'identifiant ${id}.` });

    res.status(200).json({ success: true, message: "Projet mis à jour avec succès.", data: projetMisAJour });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Erreur de validation.", errors: messages });
    }
    console.error("[updateProjet]", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour du projet." });
  }
};

// DELETE /api/projets/:id
const deleteProjet = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ success: false, message: `Identifiant invalide : "${id}".` });
  try {
    const projetSupprime = await Projet.findByIdAndDelete(id);
    if (!projetSupprime) return res.status(404).json({ success: false, message: `Aucun projet trouvé avec l'identifiant ${id}.` });
    res.status(200).json({ success: true, message: `Le projet "${projetSupprime.libelle}" a été supprimé.`, data: projetSupprime });
  } catch (error) {
    console.error("[deleteProjet]", error.message);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la suppression du projet." });
  }
};

module.exports = { getAllProjets, getProjetById, createProjet, updateProjet, deleteProjet };
