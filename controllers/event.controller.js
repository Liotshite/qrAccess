const eventService = require('../services/event.service');
const categoryService = require('../services/category.service');

exports.renderEvents = async (req, res) => {
  const events = await eventService.findAll();
  const nbr = await eventService.countEvents();
  res.render("event/listEvents", { events, nbr });
}


exports.renderViewEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    const event = await eventService.findById(eventId);
    res.render("event/Qr/listQr", { event });
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}



exports.renderCreateEvent = async (req, res) => {
  const categories = await categoryService.findAll();
  res.render("event/createEvent", { categories });
}


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
      res.redirect('/event/events?Event created');
    } else {
      res.redirect('/event/events?Event already exist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite.');
  }
}


exports.renderUpdateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await eventService.findById(eventId);
    const categories = await categoryService.findAll();
    res.render("event/updateEvent", { event, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
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
    res.redirect('/event/events?Event updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}



exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    await eventService.deleteEvent(eventId);
    res.redirect('/event/events?Event deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}



exports.restoreEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    await eventService.restoreEvent(eventId);
    res.redirect('/event/events?Event restored');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}



exports.deletePermanentlyEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    await eventService.deletePermanentlyEvent(eventId);
    res.redirect('/event/events?Event deleted permanently');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}


exports.renderTrashEvent = async (req, res) => {
  try {
    const events = await eventService.findAllDeleted();
    res.render("event/trashEvent", { events });
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite');
  }
}
