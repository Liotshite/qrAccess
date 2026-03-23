const eventService = require('../services/event.service');

// Get all events for the current organization
exports.getEvents = async (req, res) => {
    try {
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const orgId = req.user.org_id;
        const search = req.query.search;

        let events;
        if (search) {
            events = await eventService.findByTitle(orgId, search);
        } else {
            events = await eventService.findAll(orgId);
        }

        // Format for frontend
        const formattedEvents = events.map(e => {
            const now = new Date();
            let status = "Active";
            if (new Date(e.start_date) > now) status = "Upcoming";
            if (new Date(e.end_date) < now) status = "Past";

            return {
                id: e.event_id,
                name: e.title,
                date: `${new Date(e.start_date).toLocaleDateString()} - ${new Date(e.end_date).toLocaleDateString()}`,
                location: e.location || "N/A",
                qrs: e._count?.qr_codes || 0,
                status: status
            };
        });

        res.status(200).json({ success: true, events: formattedEvents });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// Get single event details
exports.getEventById = async (req, res) => {
    try {
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const orgId = req.user.org_id;
        const eventId = Number(req.params.event_id);

        const event = await eventService.findById(orgId, eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Événement introuvable" });
        }

        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const { title, description, location, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Titre, Date de début et Date de fin sont requis" });
        }

        const orgId = req.user.org_id;

        const newEvent = await eventService.createEvent({
            title: title,
            description: description,
            location: location,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            org_id: orgId
        });

        res.status(201).json({ success: true, message: 'Événement créé avec succès', event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la création" });
    }
}

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const orgId = req.user.org_id;
        const eventId = Number(req.params.event_id);
        const { title, description, location, startDate, endDate } = req.body;

        // Verify ownership first
        const existingEvent = await eventService.findById(orgId, eventId);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: "Événement introuvable ou non autorisé" });
        }

        const updatedEvent = await eventService.updateEvent(eventId, {
            title,
            description,
            location,
            start_date: startDate ? new Date(startDate) : undefined,
            end_date: endDate ? new Date(endDate) : undefined
        });

        res.status(200).json({ success: true, message: 'Événement mis à jour', event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

// Delete an event (Soft Delete)
exports.deleteEvent = async (req, res) => {
    try {
        if (!req.user || !req.user.org_id) {
            return res.status(401).json({ success: false, message: "Non autorisé" });
        }

        const orgId = req.user.org_id;
        const eventId = Number(req.params.event_id);

        // Verify ownership
        const existingEvent = await eventService.findById(orgId, eventId);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: "Événement introuvable" });
        }

        await eventService.deleteEvent(eventId);
        res.status(200).json({ success: true, message: 'Événement supprimé' });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

