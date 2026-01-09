const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));
const userController = require("../controllers/user.controller");



// Page login
router.get("/login", userController.renderLogin);

// Login submit
router.post("/login", userController.login);


// Page signIn
router.get("/signin", userController.renderSignIn);


// SignIn submit
router.post('/signin', userController.signin);


// Route pour voir le profil
router.get('/profile',authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const user = await getProductorById(userId);
    res.render('user/profile',{user:user});
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la page.');
  }
});




// Route pour voir le profil
router.get('/profileA',authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const user = await getProductorById(userId);
    res.render('admin/profile',{user:user});
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la page.');
  }
});


// Route de logout
router.get('/logout', (req, res) => {
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
});



module.exports = router;
