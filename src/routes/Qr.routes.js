const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));
const crypto = require('crypto');
const multer = require("multer");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const qrController = require("../controllers/qr.controller");





// Page event
router.get("/qrs",qrController );


// Page view Event
router.get("/viewQr", qrController);



// Page create event 
router.get("/createQr", qrController);
//Create event 
router.post("/createQr",authMiddleware,qrController);



//Delete event 
router.post("/deleteQr",authMiddleware,qrController);































router.post('/ajoutP',authenticateToken, upload.array("images"), async (req, res) => {
  try {
    const { name, description,category,zone } = req.body;
    const userId = req.user.id;
    const productData = {
      uuid,name,description,category,
      images: req.files.map(file => "/uploads/" + file.filename)
    };
    const qrData = `http://192.168.1.101:3000/produit/prod/${uuid}`;
    const fileName = `${uuid}.png`.replace(/\s+/g, '_');
    const filePath = `public/qrcodes/${fileName}`;
    await QRCode.toFile(filePath, qrData);
    await saveProduct(uuid, name,"Nsell", description,category,zone, userId, productData.images);
    console.log('Données enregistrées avec succès');
    res.redirect('/produit/myprod');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});




// Route pour afficher le formulaire d'ajout produit
router.get('/update/:uuid',authenticateToken, async (req,res) => {
  try {
    const produit = await getProductById(req.params.uuid);
    const categories = await getCategories(); 
    const zones = await getZone();
    res.render('modifierProduit', { categories,zones,produit });
  } catch (err) {
    console.error(err);
  }
});



router.post('/updateP/:uuid',authenticateToken, upload.array("images"), async (req, res) => {
  try {
    const { name, description,category,zone } = req.body;
    const produit = await getProductById(req.params.uuid);
    const productData = {
      images: req.files.map(file => "/uploads/" + file.filename)
    };
    await updateProduct(req.params.uuid, name, description,category,zone, produit.images);
    console.log('Données enregistrées avec succès');
    res.redirect('/produit/myprod');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});






router.get('/qrcode/:uuid', authenticateToken, async (req, res) => {
  try {
    const produit = await getProductById(req.params.uuid);
    if (!produit) {
      return res.status(404).send('Produit non trouvé');
    }
    const qrFilename = `${produit.uuid}.png`.replace(/\s+/g, '_');
    const qrPath = path.join(__dirname, '../public/qrcodes', qrFilename);
    // Vérifier si le fichier QR code existe
    if (!fs.existsSync(qrPath)) {
      return res.status(404).send('QR code non trouvé');
    }
    res.render('Qr', { 
      produit: {
        name: produit.name,
        uuid: produit.uuid,
        description: produit.description,
        qrUrl: `/qrcodes/${qrFilename}`  
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});




// Route pour afficher les transactions
router.get('/mytransactions',authenticateToken, async (req,res) => {
  try {
    const transactions = await getUserTransactions(req.user.id);
    res.render('user/MesTransaction',{transactions : transactions});
  } catch (err) {
    console.error(err);
  }
});








module.exports = router;