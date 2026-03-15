const express = require('express');
const router = express.Router();
const eventController = require('../controllers/api.event.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all event routes
router.use(authMiddleware);

// GET /events (Get all events for user's org)
router.get("/", eventController.getEvents);

// GET /events/:eventId (Get specific event details)
router.get("/:eventId", eventController.getEventById);

// POST /events (Create new event)
router.post("/", eventController.createEvent);

// PUT /events/:eventId (Update event)
router.put("/:eventId", eventController.updateEvent);

// DELETE /events/:eventId (Soft delete)
router.delete("/:eventId", eventController.deleteEvent);

module.exports = router;
