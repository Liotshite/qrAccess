const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ===== Middlewares globaux =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


// ===== Configuration EJS =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// ===== Fichiers statiques =====
app.use(express.static(path.join(__dirname, "statics")));



// ===== Routes =====
const authRoutes = require("./routes/user.routes");   
const eventRoutes = require("./routes/event.routes");


app.use("/user", authRoutes);
app.use("/event", eventRoutes);



// ===== Lancer le serveur =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
