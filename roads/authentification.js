const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getProductorById, getProductor } = require('../controllers/DBController');
const authenticateToken = require('../middleware/authMiddleware');
router.use(express.urlencoded({ extended: true }));
router.use(express.static("public"));
 





// Route pour le login
router.get('/login', async (req, res) => {
  try {
    res.render('user/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de la page.');
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getProductor();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Cette email est non reconnu" });
    } else if(!(await bcrypt.compare(password, user.password))){
      return res.status(401).json({ message: "mot de passe incorrect" });
    }
    const token = jwt.sign({ id: user.idproducteur,email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 14400000
    });
    if (user.typeuser == "admin") {
      res.redirect('/user/listuser?message=Connexion reussi');
    } else {
      res.redirect('/produit/myprod?message=Connexion reussi');
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la connexion.');
  }
  
});






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