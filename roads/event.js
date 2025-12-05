// const { getCategories } = require("../controllers/DBController");
const express = require('express');
const router = express.Router();
//const authenticateToken = require('../middleware/authMiddleware');




// show events
router.get('/events',/*authenticateToken,*/ async (req,res) =>{
    try {
        // const events = await getEvents();
        res.render('events/viewEvents');

    } catch (error) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des données.');
    }
});




// show create event
router.get('/add',/*authenticateToken,*/ async (req,res) => {
  try {
    res.render('events/createEvent');
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

