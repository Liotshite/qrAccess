const prisma = require("../prisma/client");

exports.findByName = (eventname) => {
  return prisma.event.findUnique({
    where: { eventname }
  });
};


exports.createEvent = (data) =>{
    return prisma.event.create({ data});
}