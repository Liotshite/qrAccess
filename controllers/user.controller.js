const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { name } = require("ejs");



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
    res.redirect("/event/events?message=Connexion réussie");

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la connexion.");
  }
};






exports.renderSignIn = (req, res) => {
  res.render("user/signin");
}



exports.signin = async (req, res) => {
  try {
    const { name, password } = req.body;
    var user = await userService.findByName(name);
    if (!user) {
      const hashed = await bcrypt.hash(password, 10);
      user = { name: name, password: hashed }
      await userService.createUser(user);
      res.redirect('/user/login?message=Inscription réussie, vous pouvez maintenant vous connecter');
    } else {
      res.redirect('/user/signin?message=Ce nom d\'utilisateur est déjà pris');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite.');
  }
}





exports.viewprofile = async (req, res) => {
  try {
    const user = req.user;
    res.render('user/profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la page.');
  }
};




exports.logout = async (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Erreur lors de la destruction de la session :', err);
        return res.status(500).send('Erreur lors de la déconnexion.');
      }
      res.clearCookie('connect.sid');
      res.redirect('/user/login');
    });
  } else {
    res.redirect('/user/login');
  }
};