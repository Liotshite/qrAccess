require("dotenv").config();
const app = require("./src/app");




// ===== Lancer le serveur =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
