const eventService = require('../services/event.service');


exports.renderEvents = (req,res) => {
  res.render("events/listEvents");
}


exports.renderViewEvent = (res,req) => {

 }


exports.renderCreateEvent = (req,res) => {
  res.render("events/createEvent");
}

exports.createEvent = async (req,res) => {
  try {
    const {Eventname,Customer,description,dateEv} = req.body;
    var event = await eventService.findByName(Eventname);
    
    if (!event) {
      const Cdate = new Date();
      const userId = req.user.id;
      event = { Eventname: Eventname, 
                customer: Customer,
                description: description,
                userId:      userId,
                dateevent:   dateEv,
                creationdate : Cdate
              }
      await eventService.createEvent(event);
      res.redirect('/event/events?Event created');
    }else{
      res.redirect('/event/events?Event already exist');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite.');
  }
}

