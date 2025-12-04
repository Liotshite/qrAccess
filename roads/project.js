// const { getCategories } = require("../controllers/DBController");
const express = require('express');
const router = express.Router();
//const authenticateToken = require('../middleware/authMiddleware');




// show projects
router.get('/projects',/*authenticateToken,*/ async (req,res) =>{
    try {
        // const projects = await getProjects();
        res.render('projects/viewprojects');

    } catch (error) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des données.');
    }
});




// show create project
router.get('/add',/*authenticateToken,*/ async (req,res) => {
  try {
    res.render('projects/createProject');
  } catch (err) {
    console.error(err);
  }
});



router.post('/addP'/*,authenticateToken*/, async (req, res) => {
  try {
    const { namecat, description } = req.body;
    const userId = req.user.id;
    await saveCategorie(namecat, description);
    res.redirect('/categorie/ajout');

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



module.exports = router;

