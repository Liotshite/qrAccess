const prisma = require("../prisma/client");
// Find by the name 
exports.findByName = async (eventname) => {
  return await prisma.event.findFirst({
    where: { eventname }
  });
};

// Find all events
exports.findAll = async () =>{
  return await prisma.event.findMany();
};

// Create event
exports.createEvent = async (data) =>{
  return await prisma.event.create({ data});
};


//count event in bdd
exports.countEvents = async () => {
  return prisma.event.count();
};
