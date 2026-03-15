const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const cors = require('cors');

// ===== Configurer CORS pour React =====
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Très important puisque tu utilises cookie-parser
}));

// ===== Middlewares globaux =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// ===== Fichiers statiques =====
app.use(express.static(path.join(__dirname, "statics")));



// Importer les différentes routes depuis le dossier src/routes/
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const categoryRoutes = require("./routes/category.routes");
const qrRoutes = require("./routes/qr.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// ===== Utilisation des routes =====
// On préfixe toutes les routes utilisateurs par /user (/user/login, /user/signup, etc.)
app.use("/user", userRoutes);

// On préfixe toutes les autres routes (événements, qrcodes...) par leur nom logique
app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/qr", qrRoutes);
app.use("/dashboard", dashboardRoutes);


module.exports = app;