const eventService = require('../services/event.service');
const categoryService = require('../services/category.service');

// ----------- render ----------------------

exports.renderEvents = async (req, res) => {
    const events = await eventService.findAll();
    const nbr = await eventService.countEvents();
    res.status(200).json({ events, nbr });
}


exports.renderViewEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        const event = await eventService.findById(eventId);
        res.status(200).json({ event });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}




exports.renderTrashEvent = async (req, res) => {
    try {
        const events = await eventService.findAllDeleted();
        const nbr = await eventService.countEventsTrash();
        res.status(200).json({ events, nbr });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}


exports.researchTrashEvent = async (req, res) => {
    const search = req.query.search;
    const events = await eventService.findByNameTrash(search);
    res.status(200).json({ events });
}


exports.researchEvent = async (req, res) => {
    const search = req.query.search;
    const events = await eventService.findByName(search);
    res.status(200).json({ events });
}



// ------------------- logic ------------------------
exports.createEvent = async (req, res) => {
    try {
        var { eventName, customer, category, description, dateEv } = req.body;
        var event = await eventService.findByName(eventName);
        var cat = parseInt(category);
        if (!event) {
            const Cdate = new Date();
            const userId = req.user.id;
            event = {
                eventname: eventName,
                customer: customer,
                description: description,
                userId: userId,
                categoryId: cat,
                dateevent: new Date(dateEv),
                creationdate: Cdate
            }
            await eventService.createEvent(event);
            res.status(200).json({ message: 'Event created' });
        } else {
            res.status(400).json({ message: 'Event already exist' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite.');
    }
}




exports.updateEvent = async (req, res) => {
    try {
        const { eventId, eventName, customer, category, description, dateEv } = req.body;
        await eventService.updateEvent(eventId, {
            eventname: eventName,
            customer: customer,
            description: description,
            categoryId: parseInt(category),
            dateevent: new Date(dateEv)
        });
        res.status(200).json({ message: 'Event updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}



exports.deleteEvent = async (req, res) => {
    try {
        console.log('le numero est', req.params.eventId);
        const eventId = Number(req.params.eventId);
        await eventService.deleteEvent(eventId);
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}




exports.restoreEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        await eventService.restoreEvent(eventId);
        res.status(200).json({ message: 'Event restored' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}



exports.deletePermanentlyEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        await eventService.deletePermanentlyEvent(eventId);
        res.status(200).json({ message: 'Event deleted permanently' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite');
    }
}



