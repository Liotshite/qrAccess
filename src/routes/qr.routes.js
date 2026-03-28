const express = require('express');
const router = express.Router();
const qrController = require("../controllers/api.qr.controller");
const qrVerifyController = require("../controllers/api.qr_verify.controller");
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'tmp/uploads/' });

// Vérification d'un QR code (Scanner)
router.post("/verify", authMiddleware, qrVerifyController.verifyScan);

// Récupération de tous les QR codes 
router.get("/qrs", authMiddleware, qrController.getAllQrs);

// Récupération des QR codes d'un événement spécifique
router.get("/event/:event_id", authMiddleware, qrController.getQrsByEvent);

// Générer un QR code pour un événement spécifique
router.post("/generate/:event_id", authMiddleware, qrController.generateQrForEvent);

// Importer des QR codes depuis un CSV
router.post("/import/:event_id", authMiddleware, upload.single('file'), qrController.importQrsFromCSV);

// Révoquer un QR code
router.put("/revoke/:id", authMiddleware, qrController.revokeQr);


// Note: Toutes les anciennes routes (/ajoutP, /updateP, /mytransactions) 
// qui semblaient concerner un autre projet ("produits") ont été supprimées 
// pour garder une API REST propre dédiée à Qr Access 2.


module.exports = router;