const prisma = require("../prisma/client");
// Find by the name 
exports.findByName = async (catname) => {
  return await prisma.category.findFirst({
    where: { catname }
  });
};

// Find all events
exports.findAll = async () => {
  return await prisma.category.findMany();
};

// Create event
exports.createCat = async (data) => {
  return await prisma.category.create({ data });
};


//count event in bdd
exports.countCats = async () => {
  return await prisma.category.count();
};


// delete cat
exports.deleteCat = async (id) => {
  await prisma.category.delete(id);
}