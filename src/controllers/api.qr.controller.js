const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const eventService = require('../services/event.service');
const qrService = require('../services/qr.service');

// Générer un QR Code
exports.generateQrForEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        const event = await eventService.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Événement non trouvé' });
        }

        // Les données encodées dans le QR Code (peut être un lien vers l'app mobile, ou un ID)
        const qrData = JSON.stringify({ eventId: event.id, eventName: event.eventname });

        // Le dossier public/qrcodes doit exister !
        const qrFilename = `event_${event.id}.png`;
        const qrPath = path.join(__dirname, '../../statics/qrcodes', qrFilename); // Ajustez "statics" selon votre structure

        // Créer le dossier s'il n'existe pas
        const dir = path.dirname(qrPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Génération du fichier QR Code physique
        await QRCode.toFile(qrPath, qrData);

        // On renvoie l'URL (relative) permettant d'accéder à l'image du QR Code
        // Depuis React Native, on pourra l'afficher avec <Image source={{ uri: "http://votre-ip:3000/qrcodes/event_1.png" }} />
        return res.status(200).json({
            success: true,
            message: 'QR Code généré avec succès',
            qrUrl: `/qrcodes/${qrFilename}`,
            event: { id: event.id, name: event.eventname }
        });

    } catch (error) {
        console.error('Erreur lors de la génération du QR:', error);
        return res.status(500).json({ success: false, message: 'Erreur serveur interne' });
    }
};



// Lire la liste de tous les QRs
exports.getAllQrs = async (req, res) => {
    // try {
    //     const qrs = await qrService.findAll();
    //     res.status(200).json({ success: true, qrs });
    // } catch(error) { ... }
    return res.status(200).json({ success: true, message: "Endpoint pour récupérer les QR codes" });
};
