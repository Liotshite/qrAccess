// const { getCategories } = require("../controllers/DBController");
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const eventController = require('../controllers/event.controller')




// Page event
router.get("/events", eventController.renderEvents);



// Page view Event
router.get("/viewEvent", eventController.renderViewEvent);



// Page create event 
router.get("/createEvent", eventController.renderCreateEvent);
//Create event 
router.post("/createEvent", eventController.createEvent);




// show create event
router.get('/add',authenticateToken, async (req,res) => {
  try {
    res.render('events/createEvent');
  } catch (err) {
    console.error(err);
  }
});



router.post('/addP',authenticateToken, async (req, res) => {
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

