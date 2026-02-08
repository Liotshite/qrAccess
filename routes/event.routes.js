// const { getCategories } = require("../controllers/DBController");
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/authMiddleware');



// Page event
router.get("/events", authMiddleware, eventController.renderEvents);

// Page view Event
router.get("/viewEvent/:eventId", authMiddleware, eventController.renderViewEvent);



// Page create event 
router.get("/createEvent", authMiddleware, eventController.renderCreateEvent);
//Create event 
router.post("/createEvent", authMiddleware, eventController.createEvent);


//delete event
router.post("/deleteEvent", authMiddleware, eventController.deleteEvent);





module.exports = router;

