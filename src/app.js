const express = require('express');
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");


// ===== Middlewares globaux =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ===== Configuration EJS =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// ===== Fichiers statiques =====
app.use(express.static(path.join(__dirname, "statics")));



// ===== Routes =====
const authRoads = require("./routes/user.routes");
const eventRoads = require("./routes/event.routes");
const catRoads = require("./routes/category.routes");


app.use("/user", authRoads);
app.use("/event", eventRoads);
app.use("/cat", catRoads);




module.exports = app;