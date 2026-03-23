const express = require('express');
const router = express.Router();
const qrController = require("../controllers/api.qr.controller");
const authMiddleware = require('../middleware/authMiddleware');

// Récupération de tous les QR codes 
router.get("/qrs", authMiddleware, qrController.getAllQrs);

// Récupération des QR codes d'un événement spécifique
router.get("/event/:event_id", authMiddleware, qrController.getQrsByEvent);

// Générer un QR code pour un événement spécifique
router.post("/generate/:event_id", authMiddleware, qrController.generateQrForEvent);


// Note: Toutes les anciennes routes (/ajoutP, /updateP, /mytransactions) 
// qui semblaient concerner un autre projet ("produits") ont été supprimées 
// pour garder une API REST propre dédiée à Qr Access 2.


module.exports = router;