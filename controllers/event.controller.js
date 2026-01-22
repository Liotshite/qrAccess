const eventService = require('../services/event.service');
const categoryService = require('../services/category.service');

exports.renderEvents = async (req,res) => {
  const events = await eventService.findAll();
  const nbr = await eventService.countEvents();
  res.render("event/listEvents",{events,nbr});
}


exports.renderViewEvent = async (res,req) => {
  res.render("event/viewEvent");
 }


exports.renderCreateEvent = async (req,res) => {
  const categories = await categoryService.findAll(); 
  res.render("event/createEvent",{categories});
}

exports.createEvent = async (req,res) => {
  try {
    const {Eventname,Customer,category,description,dateEv} = req.body;
    var event = await eventService.findByName(Eventname);
    
    if (!event) {
      const Cdate = new Date();
      const userId = req.user.id;
      event = { eventname: Eventname, 
                customer: Customer,
                description: description,
                userId:      userId,
                categoryId : category,
                dateevent: new Date(dateEv),
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

