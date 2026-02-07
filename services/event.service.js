const prisma = require("../prisma/client");
// Find by the name 
exports.findByName = async (eventname) => {
  return await prisma.event.findFirst({
    where: { eventname }
  });
};

// Find all events
exports.findAll = async () => {
  return await prisma.event.findMany({
    where: {
      deletedAt: null
    }
  });
};


//update event
exports.updateEvent = async (eventId, data) => {
  return prisma.event.update({
    where: { id: eventId },
    data
  });
};


// Create event
exports.createEvent = async (data) => {
  return await prisma.event.create({ data });
};


//count event in bdd
exports.countEvents = async () => {
  return prisma.event.count();
};

//delete event
exports.deleteEvent = async (eventId) => {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      deletedAt: new Date()
    }
  });
};

//finf all deleted 
exports.findAllDeleted = async () => {
  return await prisma.event.findMany({
    where: {
      deletedAt: { not: null }
    }
  });
};

//restore event
exports.restoreEvent = async (eventId) => {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      deletedAt: null
    }
  });
};

//delete permanently event
exports.deletePermanentlyEvent = async (eventId) => {
  return prisma.event.delete({
    where: { id: eventId }
  });
};

