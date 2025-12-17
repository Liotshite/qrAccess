
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

exports.renderLogin = (req, res) => {
  res.render("user/login");
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await userService.findByName(name);
    if (!user) {
      return res.status(401).json({ message: "Ce nom d'utilisateur est inconnu" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect("/events?message=Connexion réussie");

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la connexion.");
  }
};