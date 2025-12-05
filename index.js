const express = require("express");
const app = express();
//const qr = require('./roads/QrCreation');
const auth = require('./roads/authentification');
const event = require('./roads/event')
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');




// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Utiliser les routes
//app.use('/qr', qr);
app.use('/user', auth);
app.use('/event',event);

//route du dossier des images
app.use(express.static('statics'));



// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
