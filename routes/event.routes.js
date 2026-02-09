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

//update event
router.post("/updateEvent/:eventId", authMiddleware, eventController.updateEvent);

//delete event
router.get("/deleteEvent/:eventId", authMiddleware, eventController.deleteEvent);

//delete permananly
router.post("/deletePermanentlyEvent/:eventId", authMiddleware, eventController.deletePermanentlyEvent);

//restore event
router.get("/restoreEvent/:eventId", authMiddleware, eventController.restoreEvent);

//trash event
router.get("/trashEvent", authMiddleware, eventController.renderTrashEvent);

//research trash event
router.get("/researchTrashEvent", authMiddleware, eventController.researchTrashEvent);



module.exports = router;

